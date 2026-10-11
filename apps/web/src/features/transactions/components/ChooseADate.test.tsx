import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChooseADate from "./ChooseADate";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe("ChooseADate", () => {
  it("renders native time input with current time and updates on change", () => {
    const initialDate = new Date("2026-10-12T14:30:00.000Z");
    const onSelectDate = vi.fn();

    render(
      <ChooseADate
        selectedDate={initialDate}
        onSelectDate={onSelectDate}
        displayMonth={initialDate}
        onMonthChange={vi.fn()}
        onConfirm={vi.fn()}
        onPresetClick={vi.fn()}
      />,
    );

    const timeInput = screen.getByLabelText("time") as HTMLInputElement;
    expect(timeInput).toBeInTheDocument();
    expect(timeInput.type).toBe("time");

    fireEvent.change(timeInput, { target: { value: "18:45" } });

    expect(onSelectDate).toHaveBeenCalled();
    const updatedDate: Date = onSelectDate.mock.calls[0][0];
    expect(updatedDate.getHours()).toBe(18);
    expect(updatedDate.getMinutes()).toBe(45);
  });
});
