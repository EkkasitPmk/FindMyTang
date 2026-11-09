import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor as rtlWaitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const waitFor = (callback: () => void | Promise<void>) =>
  rtlWaitFor(callback, { interval: 2 });
import {
  bulkArchiveAssetsApi,
  bulkDeleteAssetsApi,
  bulkRestoreAssetsApi,
  createAssetApi,
  deleteAssetApi,
  reorderAssetsApi,
  restoreAssetApi,
  updateAssetApi,
} from "../services/assets.service";
import {
  useAssetUIStore,
  useBulkArchiveAssetsMutation,
  useBulkDeleteAssetsMutation,
  useBulkRestoreAssetsMutation,
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useReorderAssetsMutation,
  useRestoreAssetMutation,
  useUpdateAssetMutation,
} from "./assets.hook";
import { Asset, AssetType } from "@/shared/lib/types/asset.type";

vi.mock("../services/assets.service", () => ({
  createAssetApi: vi.fn(),
  updateAssetApi: vi.fn(),
  deleteAssetApi: vi.fn(),
  restoreAssetApi: vi.fn(),
  bulkDeleteAssetsApi: vi.fn(),
  bulkArchiveAssetsApi: vi.fn(),
  bulkRestoreAssetsApi: vi.fn(),
  reorderAssetsApi: vi.fn(),
}));

const mockCreateAssetApi = vi.mocked(createAssetApi);
const mockUpdateAssetApi = vi.mocked(updateAssetApi);
const mockDeleteAssetApi = vi.mocked(deleteAssetApi);
const mockRestoreAssetApi = vi.mocked(restoreAssetApi);
const mockBulkDeleteAssetsApi = vi.mocked(bulkDeleteAssetsApi);
const mockBulkArchiveAssetsApi = vi.mocked(bulkArchiveAssetsApi);
const mockBulkRestoreAssetsApi = vi.mocked(bulkRestoreAssetsApi);
const mockReorderAssetsApi = vi.mocked(reorderAssetsApi);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
};

const mockAsset: Asset = {
  id: "asset-1",
  name: "Checking",
  type: AssetType.CASH,
  balance: 500,
  color: "#2563EB",
  isArchived: false,
  includeInSnapshot: true,
  savingsAmount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("assets.hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("mutations", () => {
    it("handles useCreateAssetMutation", async () => {
      mockCreateAssetApi.mockResolvedValueOnce(mockAsset);
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useCreateAssetMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({
        name: "Checking",
        type: AssetType.CASH,
        balance: 500,
        color: "#2563EB",
        includeInSnapshot: true,
        savingsAmount: 0,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalledWith(mockAsset);
    });

    it("handles useUpdateAssetMutation with optimistic update", async () => {
      const updatedAsset: Asset = { ...mockAsset, name: "Checking Updated" };
      mockUpdateAssetApi.mockResolvedValueOnce(updatedAsset);
      const { queryClient, wrapper } = createWrapper();

      queryClient.setQueryData<Asset[]>(
        ["assets"],
        [mockAsset, { ...mockAsset, id: "asset-2", name: "Other" }],
      );
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useUpdateAssetMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({
        id: "asset-1",
        data: { name: "Checking Updated" },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(onSuccess).toHaveBeenCalledWith(updatedAsset);
    });

    it("handles useDeleteAssetMutation", async () => {
      mockDeleteAssetApi.mockResolvedValueOnce(mockAsset);
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useDeleteAssetMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({ id: "asset-1", hardDelete: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalledWith(mockAsset);
    });

    it("handles useRestoreAssetMutation", async () => {
      mockRestoreAssetApi.mockResolvedValueOnce(mockAsset);
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useRestoreAssetMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate("asset-1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalledWith(mockAsset);
    });

    it("handles useBulkDeleteAssetsMutation", async () => {
      mockBulkDeleteAssetsApi.mockResolvedValueOnce({ success: true });
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useBulkDeleteAssetsMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({ ids: ["asset-1", "asset-2"], hardDelete: false });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it("handles useReorderAssetsMutation", async () => {
      mockReorderAssetsApi.mockResolvedValueOnce({ success: true });
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useReorderAssetsMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate(["asset-2", "asset-1"]);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it("handles useBulkArchiveAssetsMutation", async () => {
      mockBulkArchiveAssetsApi.mockResolvedValueOnce({ success: true });
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useBulkArchiveAssetsMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({ ids: ["asset-1"] });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it("handles useBulkRestoreAssetsMutation", async () => {
      mockBulkRestoreAssetsApi.mockResolvedValueOnce({ success: true });
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useBulkRestoreAssetsMutation({ onSuccess }),
        { wrapper },
      );

      result.current.mutate({ ids: ["asset-1"] });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalled();
    });

    it("handles invalidateQueries rejection gracefully without throwing", async () => {
      mockCreateAssetApi.mockResolvedValueOnce(mockAsset);
      const { queryClient, wrapper } = createWrapper();
      vi.spyOn(queryClient, "invalidateQueries").mockRejectedValue(
        new Error("Network failed"),
      );

      const { result } = renderHook(() => useCreateAssetMutation(), {
        wrapper,
      });

      result.current.mutate({
        name: "Checking",
        type: AssetType.CASH,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("handles mutations without options callbacks", async () => {
      mockUpdateAssetApi.mockResolvedValueOnce(mockAsset);
      mockDeleteAssetApi.mockResolvedValueOnce(mockAsset);
      mockRestoreAssetApi.mockResolvedValueOnce(mockAsset);
      mockBulkDeleteAssetsApi.mockResolvedValueOnce({ success: true });
      mockReorderAssetsApi.mockResolvedValueOnce({ success: true });
      mockBulkArchiveAssetsApi.mockResolvedValueOnce({ success: true });
      mockBulkRestoreAssetsApi.mockResolvedValueOnce({ success: true });

      const { wrapper } = createWrapper();

      const { result: rUpdate } = renderHook(() => useUpdateAssetMutation(), {
        wrapper,
      });
      rUpdate.current.mutate({ id: "asset-1", data: { name: "Updated" } });
      await waitFor(() => expect(rUpdate.current.isSuccess).toBe(true));

      const { result: rDelete } = renderHook(() => useDeleteAssetMutation(), {
        wrapper,
      });
      rDelete.current.mutate({ id: "asset-1" });
      await waitFor(() => expect(rDelete.current.isSuccess).toBe(true));

      const { result: rRestore } = renderHook(() => useRestoreAssetMutation(), {
        wrapper,
      });
      rRestore.current.mutate("asset-1");
      await waitFor(() => expect(rRestore.current.isSuccess).toBe(true));

      const { result: rBulkDelete } = renderHook(
        () => useBulkDeleteAssetsMutation(),
        { wrapper },
      );
      rBulkDelete.current.mutate({ ids: ["asset-1"] });
      await waitFor(() => expect(rBulkDelete.current.isSuccess).toBe(true));

      const { result: rReorder } = renderHook(
        () => useReorderAssetsMutation(),
        { wrapper },
      );
      rReorder.current.mutate(["asset-1"]);
      await waitFor(() => expect(rReorder.current.isSuccess).toBe(true));

      const { result: rBulkArchive } = renderHook(
        () => useBulkArchiveAssetsMutation(),
        { wrapper },
      );
      rBulkArchive.current.mutate({ ids: ["asset-1"] });
      await waitFor(() => expect(rBulkArchive.current.isSuccess).toBe(true));

      const { result: rBulkRestore } = renderHook(
        () => useBulkRestoreAssetsMutation(),
        { wrapper },
      );
      rBulkRestore.current.mutate({ ids: ["asset-1"] });
      await waitFor(() => expect(rBulkRestore.current.isSuccess).toBe(true));
    });
  });

  describe("useAssetUIStore", () => {
    it("toggles and sets editing list state", () => {
      const store = useAssetUIStore.getState();

      act(() => store.setEditingList(true));
      expect(useAssetUIStore.getState().isEditingList).toBe(true);

      act(() => store.toggleEditingList());
      expect(useAssetUIStore.getState().isEditingList).toBe(false);
    });

    it("sets hasAssets, searchMode, and isEditModalOpen", () => {
      const store = useAssetUIStore.getState();

      act(() => {
        store.setHasAssets(false);
        store.setSearchMode(true);
        store.setIsEditModalOpen(true);
        store.setSearchKeyword("wallet");
        store.setFilterType("EXPENSE");
        store.setSortType("AMOUNT_LOWEST");
      });

      const state = useAssetUIStore.getState();
      expect(state.hasAssets).toBe(false);
      expect(state.isSearchMode).toBe(true);
      expect(state.isEditModalOpen).toBe(true);
      expect(state.searchKeyword).toBe("wallet");
      expect(state.filterType).toBe("EXPENSE");
      expect(state.sortType).toBe("AMOUNT_LOWEST");

      act(() => store.resetFilters());
      const resetState = useAssetUIStore.getState();
      expect(resetState.isSearchMode).toBe(false);
      expect(resetState.isEditModalOpen).toBe(false);
      expect(resetState.searchKeyword).toBe("");
      expect(resetState.filterType).toBe("ALL");
      expect(resetState.sortType).toBe("DATE_NEWEST");
    });

    it("toggles and sets dashboardAssetView and updates cookie", () => {
      const store = useAssetUIStore.getState();

      act(() => store.setDashboardAssetView("grid"));
      expect(useAssetUIStore.getState().dashboardAssetView).toBe("grid");
      expect(document.cookie).toContain("findmytang-dashboard-asset-view=grid");

      act(() => store.toggleDashboardAssetView());
      expect(useAssetUIStore.getState().dashboardAssetView).toBe("list");
      expect(document.cookie).toContain("findmytang-dashboard-asset-view=list");

      act(() => store.toggleDashboardAssetView());
      expect(useAssetUIStore.getState().dashboardAssetView).toBe("grid");
    });

    it("handles dashboardAssetView when document is undefined (SSR)", () => {
      vi.stubGlobal("document", undefined);
      try {
        const store = useAssetUIStore.getState();
        act(() => store.setDashboardAssetView("list"));
        expect(useAssetUIStore.getState().dashboardAssetView).toBe("list");

        act(() => store.toggleDashboardAssetView());
        expect(useAssetUIStore.getState().dashboardAssetView).toBe("grid");
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });
});
