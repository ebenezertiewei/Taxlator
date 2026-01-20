import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import { useAuth } from "../../state/useAuth";
import CompanyResultPanel from "./CompanyResultPanel";
import type {
	CitCalculatePayload,
	CitResult,
	CompanySize,
} from "../../api/types";

export default function Company() {
	const { authenticated } = useAuth();

	const [revenue, setRevenue] = useState("");
	const [companySize, setCompanySize] = useState<CompanySize | "">("");
	const [includeExpenses, setIncludeExpenses] = useState(false);
	const [expenses, setExpenses] = useState("");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState<CitResult | null>(null);

	const revenueN = useMemo(
		() => Number(revenue.replace(/,/g, "")) || 0,
		[revenue],
	);

	const expensesN = useMemo(
		() => Number(expenses.replace(/,/g, "")) || 0,
		[expenses],
	);

	async function onProceed() {
		if (!companySize || revenueN <= 0) return;

		setBusy(true);

		try {
			const payload: CitCalculatePayload = {
				taxType: "CIT",
				annualTurnover: revenueN,
				fixedAssets: 0,
				taxableProfit: revenueN - (includeExpenses ? expensesN : 0),
				companySize,
			};

			const { data } = await api.post<{
				success: boolean;
				data: CitResult;
			}>(ENDPOINTS.taxCalculate, payload);

			setResult(data.data);

			addHistory({
				type: "COMPANY",
				input: payload,
				result: data.data,
			});
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="Company Income Tax"
			subtitle="Calculate company income tax based on Nigerian CIT rules."
			rightPanel={
				result ? (
					<CompanyResultPanel
						result={result}
						companySize={companySize || undefined}
						isAuthenticated={authenticated}
					/>
				) : undefined
			}
		>
			<label className="text-sm font-semibold">Revenue (₦)</label>
			<input
				className="mt-1 w-full rounded border px-3 py-2"
				value={revenue}
				onChange={(e) => setRevenue(e.target.value)}
				inputMode="numeric"
			/>

			<label className="mt-4 block text-sm font-semibold">Company Size</label>
			<select
				className="mt-1 w-full rounded border px-3 py-2"
				value={companySize}
				onChange={(e) => setCompanySize(e.target.value as CompanySize)}
			>
				<option value="">Select size</option>
				<option value="SMALL">Small Company</option>
				<option value="MEDIUM">Medium Company</option>
				<option value="LARGE">Large Company</option>
			</select>

			<label className="mt-4 flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={includeExpenses}
					onChange={(e) => setIncludeExpenses(e.target.checked)}
				/>
				Include Business Expenses
			</label>

			{includeExpenses && (
				<input
					className="mt-2 w-full rounded border px-3 py-2"
					placeholder="Expenses (₦)"
					value={expenses}
					onChange={(e) => setExpenses(e.target.value)}
					inputMode="numeric"
				/>
			)}

			<button
				onClick={onProceed}
				disabled={busy}
				className="mt-6 w-full rounded bg-brand-800 py-2.5 text-sm font-semibold text-white"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
