import { describe, it, expect, vi } from "vitest";
import { handleFormError } from "./form.helper";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

describe("form.helper", () => {
  describe("handleFormError", () => {
    it("should display default message if error list is empty", () => {
      const mockSetError = vi.fn();
      handleFormError({}, mockSetError, "Default Error");
      expect(toast.error).toHaveBeenCalledWith("Default Error");
    });

    it("should call setError for valid fields based on mapping and toast for others", () => {
      const mockSetError = vi.fn();
      const mockError = {
        response: {
          data: {
            message: [
              "Name is required",
              "Invalid email address",
              "Unknown error",
            ],
          },
        },
      };

      const mapping = {
        name: "name",
        email: "emailAddress",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleFormError<any>(mockError, mockSetError, "Default Error", mapping);

      expect(mockSetError).toHaveBeenCalledWith("name", {
        type: "server",
        message: "Name is required",
      });
      expect(mockSetError).toHaveBeenCalledWith("emailAddress", {
        type: "server",
        message: "Invalid email address",
      });
      expect(toast.error).toHaveBeenCalledWith("Unknown error");
    });

    it("should toast all errors if mapping is not provided", () => {
      const mockSetError = vi.fn();
      const mockError = {
        response: {
          data: {
            message: ["Name is required"],
          },
        },
      };

      handleFormError(mockError, mockSetError, "Default Error");

      expect(toast.error).toHaveBeenCalledWith("Name is required");
      expect(mockSetError).not.toHaveBeenCalled();
    });
  });
});
