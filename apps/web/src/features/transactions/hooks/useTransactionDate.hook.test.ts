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
});
