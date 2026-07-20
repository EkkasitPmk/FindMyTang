export function getFormattedAmount(amountDigits: string) {
  if (amountDigits.length === 0)
    return { displayAmount: "", numericAmount: "" };
  const padded = amountDigits.padStart(3, "0");
  const integerPart = padded.slice(0, -2);
  const decimalPart = padded.slice(-2);
  const formattedInteger = Number(integerPart).toLocaleString("en-US");
  return {
    displayAmount: `${formattedInteger}.${decimalPart}`,
    numericAmount: `${integerPart}.${decimalPart}`,
  };
}

export const parseAmountDigits = (value: string): string => {
  let digits = value.replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (digits.length > 10) {
    digits = digits.slice(0, 10);
  }
  return digits;
};

export const convertDigitsToAmount = (digits: string): number => {
  if (digits.length === 0) return 0;
  const padded = digits.padStart(3, "0");
  const integerPart = padded.slice(0, -2);
  const decimalPart = padded.slice(-2);
  return Number(`${integerPart}.${decimalPart}`);
};

export const convertAmountToDigits = (amount: number): string => {
  return Math.round(Math.abs(amount) * 100).toString();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function formatAmount(value: number, locale: string = "en-US"): string {
  return `฿${Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNet(value: number, locale: string = "en-US"): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}฿${Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
