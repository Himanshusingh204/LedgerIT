export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount);
}

export function formatSignedCurrency(amount: number, currency: string = "USD"): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}
