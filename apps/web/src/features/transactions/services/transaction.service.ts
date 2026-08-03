import http from "@/shared/lib/api/http";
import {
  CreateTransactionPayload,
  TransactionQuery,
  UpdateTransactionRequest,
  TransactionResponse,
  PaginatedTransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  db,
  LocalTransaction,
  TransactionType as DexieTransactionType,
} from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";
import {
  transactionResponseSchema,
  paginatedTransactionResponseSchema,
} from "../schemas/transaction.response.schema";

const mapLocalToTransactionResponse = async (
  t: LocalTransaction,
): Promise<TransactionResponse> => {
  const mapped = {
    ...t,
    transactionDate: t.date,
    type: t.type as unknown as TransactionType,
  } as unknown as TransactionResponse;

  if (t.categoryId) {
    const category = await db.categories.get(t.categoryId);
    if (category) {
      mapped.category = {
        id: category.id,
        name: category.name,
        type: category.type as string,
        color: category.color ?? undefined,
        icon: category.icon ?? undefined,
      };
    }
  }

  if (t.assetId) {
    const asset = await db.assets.get(t.assetId);
    if (asset) {
      mapped.asset = {
        id: asset.id,
        name: asset.name,
        type: asset.type as string,
        balance: asset.balance,
      };
    }
  }

  if (t.toAssetId) {
    const toAsset = await db.assets.get(t.toAssetId);
    if (toAsset) {
      mapped.toAsset = {
        id: toAsset.id,
        name: toAsset.name,
        type: toAsset.type as string,
        balance: toAsset.balance,
      };
    }
  }

  return mapped;
};

const updateAssetBalance = async (assetId: string, delta: number) => {
  if (delta === 0) return;
  const asset = await db.assets.get(assetId);
  if (asset) {
    asset.balance = Number(asset.balance) + delta;
    asset.updatedAt = new Date().toISOString();
    asset.syncStatus = "pending";
    await db.assets.put(asset);
  }
};

const applyTransactionToAssets = async (
  tx: LocalTransaction,
  isReverting = false,
) => {
  const multiplier = isReverting ? -1 : 1;
  const amount = Number(tx.amount);

  if (
    tx.type === ("INCOME" as unknown as DexieTransactionType) ||
    tx.type === ("ADJUSTMENT" as unknown as DexieTransactionType)
  ) {
    await updateAssetBalance(tx.assetId, amount * multiplier);
  } else if (tx.type === ("EXPENSE" as unknown as DexieTransactionType)) {
    await updateAssetBalance(tx.assetId, -amount * multiplier);
  } else if (tx.type === ("TRANSFER" as unknown as DexieTransactionType)) {
    await updateAssetBalance(tx.assetId, -amount * multiplier);
    if (tx.toAssetId) {
      await updateAssetBalance(tx.toAssetId, amount * multiplier);
    }
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file as Base64"));
  });
};

const createGuestTransactionApi = async (
  data: CreateTransactionPayload,
  type: TransactionType,
): Promise<TransactionResponse> => {
  let attachmentUrl = null;
  if (data.file) {
    attachmentUrl = await fileToBase64(data.file);
  }

  let amount = data.amount;
  if (type === "ADJUSTMENT") {
    const asset = await db.assets.get(data.assetId);
    if (asset) {
      amount = data.amount - Number(asset.balance);
    }
  }

  const newTx = {
    id: uuidv4(),
    amount: amount,
    date: data.transactionDate,
    type: type as unknown as DexieTransactionType,
    assetId: data.assetId,
    categoryId: "categoryId" in data ? data.categoryId : null,
    toAssetId: "toAssetId" in data ? data.toAssetId : null,
    note: data.note || null,
    attachmentUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    syncStatus: "pending" as const,
  };

  await db.transactions.add(newTx);
  await applyTransactionToAssets(newTx);
  return mapLocalToTransactionResponse(newTx);
};

const createCloudTransactionApi = async (
  data: CreateTransactionPayload,
  type: TransactionType,
): Promise<TransactionResponse> => {
  const payload: Record<string, unknown> = {
    type,
    assetId: data.assetId,
    amount: data.amount,
    date: data.transactionDate,
  };

  if (data.note) payload.note = data.note;
  if ("categoryId" in data && data.categoryId)
    payload.categoryId = data.categoryId;
  if ("toAssetId" in data && data.toAssetId) payload.toAssetId = data.toAssetId;

  if (data.file) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const arrayBuffer = await data.file.arrayBuffer();
    const safeBlob = new Blob([arrayBuffer], { type: data.file.type });
    formData.append("file", safeBlob, data.file.name);

    const response = await http.post<TransactionResponse>(
      "/transactions",
      formData,
    );

    return transactionResponseSchema.parse(response.data);
  }

  const response = await http.post<TransactionResponse>(
    "/transactions",
    payload,
  );
  return transactionResponseSchema.parse(response.data);
};

export const createTransactionApi = async (
  data: CreateTransactionPayload,
  type: TransactionType,
): Promise<TransactionResponse> => {
  if (useGuestStore.getState().isGuest) {
    return createGuestTransactionApi(data, type);
  }
  return createCloudTransactionApi(data, type);
};

export const getTransactionsApi = async (query?: TransactionQuery) => {
  if (useGuestStore.getState().isGuest) {
    let all = await db.transactions.toArray();

    if (!query?.isDeleted) {
      all = all.filter((t) => !t.deletedAt);
    }

    if (query?.assetId)
      all = all.filter(
        (t) => t.assetId === query.assetId || t.toAssetId === query.assetId,
      );
    if (query?.type)
      all = all.filter(
        (t) => t.type === (query.type as unknown as DexieTransactionType),
      );
    if (query?.categoryId)
      all = all.filter((t) => t.categoryId === query.categoryId);

    if (query?.from && query?.to) {
      all = all.filter((t) => t.date >= query.from! && t.date <= query.to!);
    }

    if (query?.searchKeyword) {
      const lowerSearch = query.searchKeyword.toLowerCase();
      const normalizedSearch = query.searchKeyword.replace(/[฿,\s+-]/g, "");

      const [categories, assets] = await Promise.all([
        db.categories.toArray(),
        db.assets.toArray(),
      ]);
      const categoryMap = new Map(
        categories.map((c) => [c.id, c.name.toLowerCase()]),
      );
      const assetMap = new Map(assets.map((a) => [a.id, a.name.toLowerCase()]));

      all = all.filter((t) => {
        const noteMatch = t.note?.toLowerCase().includes(lowerSearch);
        const categoryMatch = t.categoryId
          ? categoryMap.get(t.categoryId)?.includes(lowerSearch)
          : false;
        const assetMatch = t.assetId
          ? assetMap.get(t.assetId)?.includes(lowerSearch)
          : false;
        const toAssetMatch = t.toAssetId
          ? assetMap.get(t.toAssetId)?.includes(lowerSearch)
          : false;
        const amountMatch =
          normalizedSearch !== "" &&
          Math.abs(Number(t.amount)).toFixed(2).includes(normalizedSearch);

        return (
          noteMatch ||
          categoryMatch ||
          assetMatch ||
          toAssetMatch ||
          amountMatch
        );
      });
    }

    // Sort
    const sortType = query?.sortType || "DATE_NEWEST";

    all.sort((a, b) => {
      if (sortType === "DATE_OLDEST") {
        return (a.date || "").localeCompare(b.date || "");
      }
      if (sortType === "AMOUNT_HIGHEST") {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortType === "AMOUNT_LOWEST") {
        return Number(a.amount) - Number(b.amount);
      }
      if (sortType === "asc") return (a.date || "").localeCompare(b.date || "");
      return (b.date || "").localeCompare(a.date || "");
    });

    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedData = all.slice((page - 1) * limit, page * limit);

    const [categories, assets] = await Promise.all([
      db.categories.toArray(),
      db.assets.toArray(),
    ]);
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const assetMap = new Map(assets.map((a) => [a.id, a]));

    const mappedItems = paginatedData.map((t) => {
      const mapped = {
        ...t,
        transactionDate: t.date,
        type: t.type as unknown as TransactionType,
      } as unknown as TransactionResponse;

      if (t.categoryId) {
        const category = categoryMap.get(t.categoryId);
        if (category) {
          mapped.category = {
            id: category.id,
            name: category.name,
            type: category.type as string,
            color: category.color ?? undefined,
            icon: category.icon ?? undefined,
          };
        }
      }

      if (t.assetId) {
        const asset = assetMap.get(t.assetId);
        if (asset) {
          mapped.asset = {
            id: asset.id,
            name: asset.name,
            type: asset.type as string,
            balance: asset.balance,
          };
        }
      }

      if (t.toAssetId) {
        const toAsset = assetMap.get(t.toAssetId);
        if (toAsset) {
          mapped.toAsset = {
            id: toAsset.id,
            name: toAsset.name,
            type: toAsset.type as string,
            balance: toAsset.balance,
          };
        }
      }

      return mapped;
    });

    return paginatedTransactionResponseSchema.parse({
      items: mappedItems,
      meta: { total, page, limit, totalPages },
    });
  }

  const { data } = await http.get<PaginatedTransactionResponse>(
    "/transactions",
    { params: query },
  );
  return paginatedTransactionResponseSchema.parse(data);
};

export const getAvailableDatesApi = async (
  assetId?: string,
  isDeleted?: boolean,
) => {
  if (useGuestStore.getState().isGuest) {
    let all = await db.transactions.toArray();
    if (isDeleted) {
      all = all.filter((t) => t.deletedAt);
    } else {
      all = all.filter((t) => !t.deletedAt);
    }
    if (assetId)
      all = all.filter((t) => t.assetId === assetId || t.toAssetId === assetId);

    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const map: Record<string, string[]> = {};
    all.forEach((t) => {
      const date = new Date(t.date);
      const year = date.getFullYear().toString();
      const month = MONTHS[date.getMonth()];
      if (!map[year]) map[year] = [];
      if (!map[year].includes(month)) map[year].push(month);
    });
    return map;
  }

  const { data } = await http.get<Record<string, string[]>>(
    "/transactions/available-dates",
    {
      params: { assetId, isDeleted },
    },
  );
  return data;
};

export const getTransactionApi = async (id: string) => {
  if (useGuestStore.getState().isGuest) {
    const t = await db.transactions.get(id);
    if (!t) throw new Error("Transaction not found");
    return mapLocalToTransactionResponse(t);
  }
  const { data } = await http.get<TransactionResponse>(`/transactions/${id}`);
  return data;
};

export const getTransactionYearsApi = async (): Promise<number[]> => {
  if (useGuestStore.getState().isGuest) {
    const all = await db.transactions.filter((t) => !t.deletedAt).toArray();
    const years = new Set(all.map((t) => new Date(t.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }
  const response = await http.get<number[]>("/transactions/years");
  return response.data;
};

const updateGuestTransactionApi = async (
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> => {
  const existing = await db.transactions.get(id);
  if (!existing) throw new Error("Transaction not found");

  let attachmentUrl = existing.attachmentUrl;
  if (data.file) attachmentUrl = await fileToBase64(data.file);
  else if (data.attachmentUrl === null) attachmentUrl = null;

  let deletedAt = existing.deletedAt;
  if (data.deletedAt !== undefined) {
    deletedAt = data.deletedAt;
  }

  const updated = {
    ...existing,
    type: (data.type as unknown as DexieTransactionType) ?? existing.type,
    amount: data.amount ?? existing.amount,
    assetId: data.assetId ?? existing.assetId,
    categoryId: data.categoryId ?? existing.categoryId,
    toAssetId: data.toAssetId ?? existing.toAssetId,
    date: data.transactionDate ?? existing.date,
    note: data.note ?? existing.note,
    attachmentUrl,
    deletedAt,
    updatedAt: new Date().toISOString(),
    syncStatus: "pending" as const,
  };

  const wasDeleted = !!existing.deletedAt;
  const isDeleted = !!updated.deletedAt;

  if (!wasDeleted) {
    await applyTransactionToAssets(existing, true);
  }

  if (updated.type === ("ADJUSTMENT" as unknown as DexieTransactionType)) {
    const asset = await db.assets.get(updated.assetId);
    if (asset && data.amount !== undefined) {
      updated.amount = data.amount - Number(asset.balance);
    }
  }

  await db.transactions.put(updated);

  if (!isDeleted) {
    await applyTransactionToAssets(updated, false);
  }

  return mapLocalToTransactionResponse(updated);
};

const updateCloudTransactionApi = async (
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> => {
  const payload: Record<string, unknown> = {
    type: data.type,
    assetId: data.assetId,
    amount: data.amount,
    date: data.transactionDate,
  };

  if (data.note !== undefined) payload.note = data.note;
  if (data.toAssetId !== undefined) payload.toAssetId = data.toAssetId;
  if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
  if (data.attachmentUrl === null) payload.attachmentUrl = "";
  if (data.deletedAt === null) payload.deletedAt = "null";
  else if (data.deletedAt) payload.deletedAt = data.deletedAt;

  if (data.file) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const arrayBuffer = await data.file.arrayBuffer();
    const safeBlob = new Blob([arrayBuffer], { type: data.file.type });
    formData.append("file", safeBlob, data.file.name);

    const response = await http.patch<TransactionResponse>(
      `/transactions/${id}`,
      formData,
    );

    return transactionResponseSchema.parse(response.data);
  }

  const response = await http.patch<TransactionResponse>(
    `/transactions/${id}`,
    payload,
  );
  return transactionResponseSchema.parse(response.data);
};

export const updateTransactionApi = async (
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> => {
  if (useGuestStore.getState().isGuest) {
    return updateGuestTransactionApi(id, data);
  }
  return updateCloudTransactionApi(id, data);
};

export const deleteTransactionApi = async (
  id: string,
  isHardDelete?: boolean,
): Promise<void> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.transactions.get(id);
    if (isHardDelete) {
      if (existing && !existing.deletedAt) {
        await applyTransactionToAssets(existing, true);
      }
      await db.transactions.delete(id);
    } else if (existing) {
      if (!existing.deletedAt) {
        await applyTransactionToAssets(existing, true);
      }
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      existing.syncStatus = "pending";
      await db.transactions.put(existing);
    }
    return;
  }

  await http.delete(`/transactions/${id}`, {
    params: { hardDelete: isHardDelete },
  });
};
