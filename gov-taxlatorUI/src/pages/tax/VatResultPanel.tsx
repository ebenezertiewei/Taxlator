// taxlator/src/pages/tax/VatResultPanel.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatNaira(value: unknown) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "₦0.00";
	return `₦${n.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

type Props = {
	result: unknown;
	amount: number;
	isAuthenticated: boolean; // kept for parity
};

export default function VatResultPanel({ result, amount }: Props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	const r = useMemo(() => (result ?? {}) as Record<string, unknown>, [result]);

	const vatRate = typeof r.vatRate === "number" ? r.vatRate : 0;

	const vatAmount = typeof r.vatAmount === "number" ? r.vatAmount : 0;

	const excludingVat =
		typeof r.excludingVat === "number"
			? r.excludingVat
			: typeof r.transactionAmount === "number"
				? r.transactionAmount
				: amount;

	const includingVat =
		typeof r.includingVat === "number"
			? r.includingVat
			: typeof r.result === "number"
				? r.result
				: excludingVat + vatAmount;

	const ratePct = Math.round(vatRate * 1000) / 10;

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* HEADER */}
			<div className="p-3 text-center border-b">
				<div className="text-sm text-slate-600">VAT Result</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(vatAmount)}
				</div>
				<div className="text-sm text-slate-600 mt-1">
					VAT Amount ({ratePct}%)
				</div>
			</div>

			{/* SUMMARY CARDS */}
			<div className="p-3">
				<div className="grid grid-cols-2 gap-2">
					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">
							Amount (Excl. VAT)
						</div>
						<div className="mt-1 font-semibold text-sm sm:text-base break-all text-center max-w-full">
							{formatNaira(excludingVat)}
						</div>
					</div>

					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">
							Total (Incl. VAT)
						</div>
						<div className="mt-1 font-semibold text-sm sm:text-base break-all text-center max-w-full">
							{formatNaira(includingVat)}
						</div>
					</div>
				</div>

				{/* ACCORDION TRIGGER */}
				<button
					type="button"
					onClick={() => setOpen((s) => !s)}
					className="mt-5 w-full flex items-center justify-between rounded-2xl bg-slate-50 border px-2 py-4 text-sm font-semibold"
				>
					<span>View VAT Breakdown</span>
					<span className="text-slate-500">{open ? "▴" : "▾"}</span>
				</button>

				{/* BREAKDOWN */}
				{open && (
					<div className="mt-4 rounded-2xl border bg-slate-50 py-4 px-2 w-full">
						<div className="text-brand-800 font-semibold">
							VAT Calculation Breakdown
						</div>

						<div className="mt-3 space-y-1 text-xs text-slate-700">
							<div className="flex justify-between gap-3">
								<div className="flex-1 break-words">
									Transaction Amount (Excl. VAT)
								</div>
								<div className="font-medium whitespace-nowrap">
									{formatNaira(excludingVat)}
								</div>
							</div>

							<div className="flex justify-between gap-3">
								<div className="flex-1 break-words">VAT ({ratePct}%)</div>
								<div className="font-medium whitespace-nowrap">
									{formatNaira(vatAmount)}
								</div>
							</div>
						</div>

						<hr className="my-4" />

						<div className="flex justify-between text-xs text-slate-700">
							<div>Total Amount (Incl. VAT)</div>
							<div className="font-semibold">{formatNaira(includingVat)}</div>
						</div>
					</div>
				)}

				{/* ACTION */}
				<button
					onClick={() => navigate("/calculate")}
					className="mt-6 w-full rounded bg-brand-800 text-white py-2.5 text-sm font-semibold hover:bg-brand-900"
				>
					Calculate Another Tax
				</button>
			</div>
		</div>
	);
}
