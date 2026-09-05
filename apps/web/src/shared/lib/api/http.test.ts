import { describe, expect, it, vi } from "vitest";
import http from "./http";

type InterceptorHandler<T> = {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: unknown) => unknown;
};

type InterceptorManagerWithHandlers<T> = {
  handlers: Array<InterceptorHandler<T>>;
};

describe("http client interceptor", () => {
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

    // The interceptor will attempt refresh and fail, dispatching auth:session-expired
    await expect(errorHandler!(mockError)).rejects.toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth:session-expired" }),
    );
  });
});
