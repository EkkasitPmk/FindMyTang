import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const handleFormError = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  defaultMessage: string,
  fieldMapping?: Record<string, Path<T> | Path<T>[]>,
) => {
  const message = (error as AxiosError<{ message?: string | string[] }>)
    ?.response?.data?.message;
  let errorList: string[] = [];
  if (Array.isArray(message)) {
    errorList = message;
  } else if (message) {
    errorList = [message];
  }

  if (errorList.length === 0) {
    toast.error(defaultMessage);
    return;
  }

  errorList.forEach((msg) => {
    const lowerMsg = msg.toLowerCase();
    let isMatched = false;

    // Check custom mappings if provided
    if (fieldMapping) {
      for (const [key, fieldName] of Object.entries(fieldMapping)) {
        if (lowerMsg.includes(key.toLowerCase())) {
          if (Array.isArray(fieldName)) {
            fieldName.forEach((f) =>
              setError(f, { type: "server", message: msg }),
            );
          } else {
            setError(fieldName as Path<T>, { type: "server", message: msg });
          }
          isMatched = true;
          break; // Stop after first match for this message
        }
      }
    }

    if (!isMatched) {
      toast.error(msg);
    }
  });
};
