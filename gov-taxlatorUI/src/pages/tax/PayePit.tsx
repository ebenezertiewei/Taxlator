import { useMemo, useState } from "react";
import TaxPageLayout from "./TaxPageLayout";
import { api } from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";
import { addHistory } from "../../state/history";
import type { PayePitCalculatePayload } from "../../api/types";
import { useAuth } from "../../state/useAuth";
import PayePitResultPanel from "./PayePitResultPanel";
import CurrencyInput from "../../components/CurrencyInput";
import { parseNumber } from "../../utils/numberInput";
import type { PayeResult } from "../../api/types";

export default function PayePit() {
	const [grossAnnualIncome, setGrossAnnualIncome] = useState("");

	const [includeNhIs, setIncludeNhIs] = useState(false);
	const [includeNhf, setIncludeNhf] = useState(false);

	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<PayeResult | null>(null);

	const grossIncomeNumber = useMemo(
		() => parseNumber(grossAnnualIncome),
		[grossAnnualIncome],
	);

	const pensionAmount = useMemo(
		() => grossIncomeNumber * 0.08,
		[grossIncomeNumber],
	);

	async function calculate() {
		setError("");
		setBusy(true);

		try {
			const payload = {
				taxType: "PAYE/PIT" as const,
				grossIncome: grossIncomeNumber,
				includeNhIs,
				includeNhf,
				rentRelief: parseNumber(annualRent),
				otherDeductions: parseNumber(otherDeductions),
			};

			const { data } = await api.post<{
				success: true;
				data: PayeResult;
			}>(ENDPOINTS.taxCalculate, payload);

			setResult(data.data);
		} catch {
			setError("PAYE calculation failed");
		} finally {
			setBusy(false);
		}
	}

	return (
		<TaxPageLayout
			title="PAYE / PIT Calculator"
			subtitle="Calculate your personal income tax based on Nigerian Tax Law (PITA)"
			rightPanel={
				result ? (
					<PayePitResultPanel
						result={result}
						grossIncome={grossIncomeNumber}
						isAuthenticated={authenticated}
					/>
				) : null
			}
		>
			{error && (
				<div className="mb-3 text-sm text-red-700 bg-red-50 border rounded p-2">
					{error}
				</div>
			)}

			<CurrencyInput
				label="Gross Annual Income"
				value={grossAnnualIncome}
				onChange={setGrossAnnualIncome}
				placeholder="0"
			/>

			{/* Pension (auto, no toggle) */}
			<div className="mt-4 rounded-xl border p-4 bg-white">
				<div className="text-xs font-semibold text-slate-900">
					Pension Contribution
				</div>
				<div className="text-xs text-slate-600 mt-1">
					8% deduction (₦{pensionAmount.toLocaleString("en-NG")})
				</div>
			</div>

			{/* NHIS */}
			<div className="mt-4 rounded-xl border p-4 bg-white flex justify-between">
				<div>
					<div className="text-xs font-semibold text-slate-900">
						National Health Insurance Scheme
					</div>
					<div className="text-xs text-slate-600">
						5% deduction on basic salary
					</div>
				</div>
				<input
					type="checkbox"
					className="h-4 w-4 accent-brand-800"
					checked={includeNhIs}
					onChange={(e) => setIncludeNhIs(e.target.checked)}
				/>
			</div>

			{/* NHF */}
			<div className="mt-4 rounded-xl border p-4 bg-white flex justify-between">
				<div>
					<div className="text-xs font-semibold text-slate-900">
						National Housing Fund
					</div>
					<div className="text-xs text-slate-600">
						2.5% deduction on basic salary
					</div>
				</div>
				<input
					type="checkbox"
					className="h-4 w-4 accent-brand-800"
					checked={includeNhf}
					onChange={(e) => setIncludeNhf(e.target.checked)}
				/>
			</div>

			<CurrencyInput
				label="Annual Rent (20% Relief)"
				value={annualRent}
				onChange={setAnnualRent}
				placeholder="0"
			/>

			<CurrencyInput
				label="Other Allowable Deductions"
				value={otherDeductions}
				onChange={setOtherDeductions}
				placeholder="0"
			/>

			<button
				onClick={calculate}
				disabled={busy}
				className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900 disabled:opacity-60"
			>
				{busy ? "Calculating..." : "Proceed"}
			</button>
		</TaxPageLayout>
	);
}
