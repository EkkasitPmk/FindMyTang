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
