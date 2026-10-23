import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionDescriptionField from "./TransactionDescriptionField";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        description: "DESCRIPTION",
        addANote: "Add a note",
      };
      return map[key] || key;
    },
  }),
}));

describe("TransactionDescriptionField", () => {
  it("renders with default label, placeholder, and value", () => {
    render(
      <TransactionDescriptionField
        id="test-desc"
        value="Monthly internet"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("DESCRIPTION")).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText("Add a note");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Monthly internet");
  });

  it("calls onChange when typing into the textarea", () => {
    const handleChange = vi.fn();
    render(
      <TransactionDescriptionField
        id="test-desc"
        value=""
        onChange={handleChange}
      />,
    );

    const textarea = screen.getByPlaceholderText("Add a note");
    fireEvent.change(textarea, { target: { value: "New note" } });
    expect(handleChange).toHaveBeenCalledWith("New note");
  });

  it("supports custom label and placeholder", () => {
    render(
      <TransactionDescriptionField
        id="custom-desc"
        label="Custom Label"
        placeholder="Custom Placeholder"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Custom Placeholder"),
    ).toBeInTheDocument();
  });
});
