// src/utils/numberInput.ts

/** Remove everything except digits */
export function onlyNumbers(value: string): string {
	return value.replace(/\D/g, "");
}

/** Format number string with commas (₦ handled in UI) */
export function formatNumber(value: string): string {
	if (!value) return "";
	const numeric = value.replace(/,/g, "");
	if (isNaN(Number(numeric))) return value;
	return Number(numeric).toLocaleString("en-NG");
}

/** Parse formatted number back to number */
export function parseNumber(value: string): number {
	return Number(value.replace(/,/g, "") || 0);
}

export function formatCurrency(amount: number): string {
	if (Number.isNaN(amount)) return "₦0";
	return `₦${amount.toLocaleString("en-NG")}`;
}
