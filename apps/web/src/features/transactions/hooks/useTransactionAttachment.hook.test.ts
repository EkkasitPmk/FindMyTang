import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import { compressImageFile } from "../utils/image.util";
import { useTransactionAttachment } from "./useTransactionAttachment.hook";

vi.mock("../utils/image.util", () => ({
  compressImageFile: vi.fn(async (file: File) => file),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

describe("useTransactionAttachment", () => {
  it("initializes with default states", () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));

    expect(result.current.file).toBeNull();
    expect(result.current.isLoadingAttachment).toBe(false);
    expect(result.current.removedAttachment).toBe(false);
    expect(result.current.isPhotoMenuOpen).toBe(false);
  });

  it("does nothing when handleFileChange is called without files", async () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));
    const mockEvent = {
      target: { files: undefined, value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileChange(mockEvent);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.isLoadingAttachment).toBe(false);
  });

  it("sets file and manages loading state during compression", async () => {
    let resolveCompression!: (f: File) => void;
    (
      compressImageFile as unknown as ReturnType<typeof vi.fn>
    ).mockImplementationOnce(
      () =>
        new Promise<File>((resolve) => {
          resolveCompression = resolve;
        }),
    );

    const { result } = renderHook(() => useTransactionAttachment((k) => k));
    const dummyFile = new File(["dummy"], "receipt.jpg", {
      type: "image/jpeg",
    });
    const mockEvent = {
      target: { files: [dummyFile], value: "dummy" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    let changePromise: Promise<void>;
    act(() => {
      changePromise = result.current.handleFileChange(mockEvent);
    });

    expect(result.current.isLoadingAttachment).toBe(true);

    await act(async () => {
      resolveCompression(dummyFile);
      await changePromise;
    });

    expect(result.current.isLoadingAttachment).toBe(false);
    expect(result.current.file).toBe(dummyFile);
  });

  it("handles compression failure by showing toast and resetting value", async () => {
    (
      compressImageFile as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Compression failed"));

    const getErrorMessage = vi.fn((key: string) => `error: ${key}`);
    const { result } = renderHook(() =>
      useTransactionAttachment(getErrorMessage),
    );
    const dummyFile = new File(["dummy"], "corrupted.jpg", {
      type: "image/jpeg",
    });
    const mockEvent = {
      target: { files: [dummyFile], value: "corrupted.jpg" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleFileChange(mockEvent);
    });

    expect(mockEvent.target.value).toBe("");
    expect(toast.error).toHaveBeenCalledWith("error: errProcessAttachment");
    expect(result.current.isLoadingAttachment).toBe(false);
    expect(result.current.file).toBeNull();
  });

  it("handles remove file and resets loading state", () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));

    act(() => {
      result.current.setFile(new File([], "test.jpg"));
      result.current.handleRemoveFile();
    });

    expect(result.current.file).toBeNull();
    expect(result.current.removedAttachment).toBe(true);
    expect(result.current.isLoadingAttachment).toBe(false);
  });

  it("handles take a photo by closing photo menu and clicking camera input", () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));
    const clickMock = vi.fn();
    (
      result.current
        .cameraInputRef as React.MutableRefObject<HTMLInputElement | null>
    ).current = {
      click: clickMock,
    } as unknown as HTMLInputElement;

    act(() => {
      result.current.setIsPhotoMenuOpen(true);
      result.current.handleTakeAPhoto();
    });

    expect(result.current.isPhotoMenuOpen).toBe(false);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("handles select a photo by closing photo menu and clicking file input", () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));
    const clickMock = vi.fn();
    (
      result.current
        .fileInputRef as React.MutableRefObject<HTMLInputElement | null>
    ).current = {
      click: clickMock,
    } as unknown as HTMLInputElement;

    act(() => {
      result.current.setIsPhotoMenuOpen(true);
      result.current.handleSelectAPhoto();
    });

    expect(result.current.isPhotoMenuOpen).toBe(false);
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("allows setting removedAttachment state directly", () => {
    const { result } = renderHook(() => useTransactionAttachment((k) => k));

    act(() => {
      result.current.setRemovedAttachment(true);
    });

    expect(result.current.removedAttachment).toBe(true);
  });
});
