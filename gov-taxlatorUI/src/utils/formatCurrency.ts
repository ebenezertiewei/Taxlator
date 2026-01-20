/**
 * Format number as Nigerian Naira currency
 * Example: 1234567 -> ₦1,234,567.00
 */
export function formatCurrency(amount: number): string {
	if (!Number.isFinite(amount)) return "₦0.00";

	return `₦${amount.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}
