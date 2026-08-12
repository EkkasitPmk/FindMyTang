import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TransactionHeader from "./TransactionHeader";

describe("TransactionHeader", () => {
  it("hides edit actions when requested by the desktop sheet", () => {
    render(
      <TransactionHeader
        hasAssetId
        isEditing
        hideActions
        title="Edit Transaction"
        deleteLabel="Delete"
        onBack={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.queryByLabelText("ย้อนกลับ")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Delete")).not.toBeInTheDocument();
  });
});
