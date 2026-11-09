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

  it("resets temporary state when opening calendar", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    act(() => {
      result.current.handleSelectDate(new Date("2026-08-15T10:00:00.000Z"));
    });
    expect(result.current.hasUnconfirmedDateSelection).toBe(true);

    act(() => {
      result.current.handleOpenCalendar();
    });

    expect(result.current.tempDate).toEqual(confirmedDate);
    expect(result.current.displayMonth).toEqual(confirmedDate);
    expect(result.current.hasUnconfirmedDateSelection).toBe(false);
  });

  it("handles preset date click properly", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    act(() => {
      result.current.handlePresetClick(-1);
    });

    expect(result.current.tempDate).toBeDefined();
    expect(result.current.displayMonth).toBeDefined();
    expect(result.current.hasUnconfirmedDateSelection).toBe(true);
  });

  it("handles selecting undefined date and confirming when tempDate is undefined", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    act(() => {
      result.current.setIsCalendarOpen(true);
      result.current.handleSelectDate(undefined);
    });

    expect(result.current.tempDate).toBeUndefined();
    expect(result.current.hasUnconfirmedDateSelection).toBe(false);

    act(() => {
      result.current.handleConfirmDate();
    });

    expect(setValue).not.toHaveBeenCalled();
    expect(result.current.isCalendarOpen).toBe(false);
  });

  it("updates display month directly", () => {
    const confirmedDate = new Date("2026-08-12T10:00:00.000Z");
    const nextMonth = new Date("2026-09-01T00:00:00.000Z");
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useTransactionDate(confirmedDate, setValue),
    );

    act(() => {
      result.current.setDisplayMonth(nextMonth);
    });

    expect(result.current.displayMonth).toEqual(nextMonth);
  });
});
