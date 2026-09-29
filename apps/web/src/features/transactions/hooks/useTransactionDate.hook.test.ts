import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTransactionDate } from "./useTransactionDate.hook";

describe("useTransactionDate", () => {
  it("marks a changed temporary date as unconfirmed", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    act(() => {
      result.current.handleSelectDate(new Date("2026-08-13T11:30:00.000Z"));
    });

    expect(result.current.hasUnconfirmedDateSelection).toBe(true);
  });

  it("marks a changed time on the same date as unconfirmed and confirms with new ISO string", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    const updatedTimeDate = new Date("2026-08-12T14:30:00.000Z");

    act(() => {
      result.current.handleSelectDate(updatedTimeDate);
    });

    expect(result.current.hasUnconfirmedDateSelection).toBe(true);

    act(() => {
      result.current.handleConfirmDate();
    });

    expect(setValue).toHaveBeenCalledWith(
      "transactionDate",
      updatedTimeDate.toISOString(),
      { shouldValidate: true },
    );
    expect(result.current.hasUnconfirmedDateSelection).toBe(false);
  });
});
