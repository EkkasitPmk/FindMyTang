import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import http, { refreshClient } from "./http";

type InterceptorHandler<T> = {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: unknown) => unknown;
};

type InterceptorManagerWithHandlers<T> = {
  handlers: Array<InterceptorHandler<T>>;
};

describe("http client interceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("attaches requestSentAt timestamp on outgoing requests", async () => {
    const requestManager = http.interceptors
      .request as unknown as InterceptorManagerWithHandlers<
      Record<string, unknown>
    >;
    const requestHandler = requestManager.handlers[0]?.fulfilled;
    expect(requestHandler).toBeDefined();

    const config = await requestHandler!({ headers: {} });
    expect((config as { requestSentAt?: number }).requestSentAt).toBeTypeOf(
      "number",
    );
  });

  it("dispatches auth:session-expired when refresh fails with 401", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const error401 = new AxiosError(
      "Unauthorized",
      "401",
      undefined,
      undefined,
      {
        status: 401,
        data: {},
        headers: {},
        statusText: "Unauthorized",
        config: {} as unknown as InternalAxiosRequestConfig,
      },
    );
    vi.spyOn(refreshClient, "post").mockRejectedValueOnce(error401);

    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;
    expect(errorHandler).toBeDefined();

    const mockError = {
      config: {
        url: "/summary/today",
        requestSentAt: Date.now(),
      },
      response: {
        status: 401,
      },
    };

    await expect(errorHandler!(mockError)).rejects.toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth:session-expired" }),
    );
    dispatchSpy.mockRestore();
  });

  it("does not dispatch auth:session-expired on transient network or timeout error", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const networkError = new AxiosError("Network Error", "ERR_NETWORK");
    vi.spyOn(refreshClient, "post").mockRejectedValueOnce(networkError);

    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;
    expect(errorHandler).toBeDefined();

    const mockError = {
      config: {
        url: "/summary/today",
        requestSentAt: Date.now(),
      },
      response: {
        status: 401,
      },
    };

    await expect(errorHandler!(mockError)).rejects.toThrow("Network Error");
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth:session-expired" }),
    );
    dispatchSpy.mockRestore();
  });

  it("dispatches auth:session-expired only once for concurrent requests when refresh fails with 401", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const error401 = new AxiosError(
      "Unauthorized",
      "401",
      undefined,
      undefined,
      {
        status: 401,
        data: {},
        headers: {},
        statusText: "Unauthorized",
        config: {} as unknown as InternalAxiosRequestConfig,
      },
    );
    vi.spyOn(refreshClient, "post").mockRejectedValueOnce(error401);

    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;
    expect(errorHandler).toBeDefined();

    const createMockError = (url: string) => ({
      config: {
        url,
        requestSentAt: Date.now(),
      },
      response: {
        status: 401,
      },
    });

    const results = await Promise.allSettled([
      errorHandler!(createMockError("/api/v1/auth/me")),
      errorHandler!(createMockError("/api/v1/assets")),
      errorHandler!(createMockError("/api/v1/summary/monthly")),
      errorHandler!(createMockError("/api/v1/transactions")),
    ]);

    expect(results.every((r) => r.status === "rejected")).toBe(true);
    const sessionExpiredCalls = dispatchSpy.mock.calls.filter(
      ([event]) => (event as CustomEvent)?.type === "auth:session-expired",
    );
    expect(sessionExpiredCalls).toHaveLength(1);
    dispatchSpy.mockRestore();
  });

  it("passes response through fulfilled response interceptor", async () => {
    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const fulfilledHandler = responseManager.handlers[0]?.fulfilled;
    expect(fulfilledHandler).toBeDefined();

    const mockResponse = { data: { success: true }, status: 200 };
    expect(await fulfilledHandler!(mockResponse)).toBe(mockResponse);
  });

  it("handles 429 rate limit with custom and default toast messages", async () => {
    const { toast } = await import("react-toastify");
    const toastSpy = vi
      .spyOn(toast, "error")
      .mockImplementation(() => "" as never);

    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;

    // Custom 429 message
    const custom429 = {
      config: { url: "/transactions" },
      response: { status: 429, data: { message: "Too many transactions" } },
    };
    await expect(errorHandler!(custom429)).rejects.toBe(custom429);
    expect(toastSpy).toHaveBeenCalledWith("Too many transactions");

    // Default 429 message
    const default429 = {
      config: { url: "/transactions" },
      response: { status: 429, data: {} },
    };
    await expect(errorHandler!(default429)).rejects.toBe(default429);
    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringContaining("คุณส่งคำขอถี่เกินไป"),
    );

    toastSpy.mockRestore();
  });

  it("skips auth refresh and rethrows 401 when skipAuthRefresh or login endpoint or already retried", async () => {
    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;

    // _retry is true
    const alreadyRetried = {
      config: { url: "/api/v1/assets", _retry: true },
      response: { status: 401 },
    };
    await expect(errorHandler!(alreadyRetried)).rejects.toBe(alreadyRetried);

    // skipAuthRefresh is true
    const skipRefresh = {
      config: { url: "/api/v1/assets", skipAuthRefresh: true },
      response: { status: 401 },
    };
    await expect(errorHandler!(skipRefresh)).rejects.toBe(skipRefresh);

    // login endpoint
    const loginEndpoint = {
      config: { url: "/api/v1/auth/login" },
      response: { status: 401 },
    };
    await expect(errorHandler!(loginEndpoint)).rejects.toBe(loginEndpoint);

    // Non-401 error (e.g. 500)
    const serverError = {
      config: { url: "/api/v1/assets" },
      response: { status: 500 },
    };
    await expect(errorHandler!(serverError)).rejects.toBe(serverError);
  });

  it("refreshes access token successfully and retries request, and retries subsequent outdated requests directly", async () => {
    const responseManager = http.interceptors
      .response as unknown as InterceptorManagerWithHandlers<unknown>;
    const errorHandler = responseManager.handlers[0]?.rejected;

    vi.spyOn(refreshClient, "post").mockResolvedValueOnce({ data: {} });
    const originalAdapter = http.defaults.adapter;
    const mockAdapter = vi.fn(async (config) => ({
      data: "retried-success",
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }));
    http.defaults.adapter = mockAdapter;

    const requestTime = Date.now();
    const mock401Error = {
      config: {
        url: "/api/v1/assets",
        requestSentAt: requestTime,
      },
      response: { status: 401 },
    };

    const retryResult = (await errorHandler!(mock401Error)) as {
      data: string;
    };
    expect(retryResult.data).toBe("retried-success");
    expect(refreshClient.post).toHaveBeenCalledWith("/auth/refresh");

    // Next request sent before the refresh succeeded (requestSentAt < lastSuccessfulRefreshAt)
    const outdatedRequestError = {
      config: {
        url: "/api/v1/transactions",
        requestSentAt: requestTime - 1000,
      },
      response: { status: 401 },
    };

    const directRetryResult = (await errorHandler!(outdatedRequestError)) as {
      data: string;
    };
    expect(directRetryResult.data).toBe("retried-success");
    // Should NOT have called refresh again:
    expect(refreshClient.post).toHaveBeenCalledTimes(1);

    http.defaults.adapter = originalAdapter;
  });

  it("uses backendUrl in server-side environment when window is undefined", async () => {
    vi.resetModules();
    const originalWindow = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).window;
    try {
      const { default: nodeHttp, refreshClient: nodeRefresh } =
        await import("./http");
      expect(nodeHttp.defaults.baseURL).toBe(
        process.env.NEXT_PUBLIC_URL_BACKEND,
      );
      expect(nodeRefresh.defaults.baseURL).toBe(
        process.env.NEXT_PUBLIC_URL_BACKEND,
      );
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
