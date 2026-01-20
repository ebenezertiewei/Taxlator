import { useState } from "react";
import type { PayeResult } from "../../api/types";

type Props = {
	result?: PayeResult;
};

export default function PayePitResultPanel({ result }: Props) {
	const [open, setOpen] = useState(false);

	const totalDeductions =
		typeof r.totalDeductions === "number"
			? r.totalDeductions
			: Object.values(deductions).reduce(
					(sum: number, v) => sum + (Number(v) || 0),
					0,
				);

	return (
		<div className="bg-white rounded-2xl shadow-soft overflow-hidden">
			{/* HEADER */}
			<div className="p-6 text-center border-b">
				<p className="text-sm text-slate-500">Salaried (PAYE / PIT) Result</p>
				<p className="text-3xl font-bold text-brand-700 mt-1">
					₦{result.totalTax.toLocaleString()}
				</p>
				<p className="text-xs text-slate-500 mt-1">Total Tax Due</p>
			</div>

			{/* SUMMARY CARDS */}
			<div className="p-6 grid grid-cols-2 gap-4">
				<StatCard label="Gross Income" value={result.grossIncome} />
				<StatCard label="Net Income" value={result.netIncome} />
			</div>

			{/* TOGGLE */}
			<div className="px-6">
				<button
					onClick={() => setOpen((v) => !v)}
					className="w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
				>
					View Tax Breakdown
					<span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
				</button>
			</div>

			{/* BREAKDOWN */}
			{open && (
				<div className="p-6">
					<div className="bg-slate-50 border rounded-xl p-5 space-y-6">
						<h3 className="font-semibold text-brand-700">
							Tax Calculation Breakdown
						</h3>

						{/* DEDUCTIONS */}
						<div className="space-y-1 text-sm">
							{result.deductions.map((d) => (
								<Row key={d.key} label={d.label} value={-d.amount} />
							))}

							<hr className="my-2" />

							<Row
								label="Total Deductions"
								value={result.totalDeductions}
								bold
							/>
							<Row label="Annual Taxable Income" value={result.taxableIncome} />
						</div>

						{/* PAYE BANDS */}
						<div>
							<p className="text-sm font-semibold mb-2">
								Progressive Tax Bands (Annual)
							</p>
							<div className="space-y-1 text-sm text-slate-600">
								{result.computation.map((b, i) => (
									<div key={i} className="flex justify-between">
										<span>
											{Math.round(b.rate * 100)}% of ₦
											{b.taxableAmount.toLocaleString()}
										</span>
										<span>₦{b.tax.toLocaleString()}</span>
									</div>
								))}
							</div>
						</div>

						<hr />

						{/* TOTALS */}
						<div className="space-y-1 text-sm">
							<Row label="Total Annual Tax" value={result.totalTax} bold />
							<Row label="Monthly Tax" value={result.totalTax / 12} />
						</div>
					</div>
				</div>
			)}

			{/* CTA */}
			<div className="p-6">
				<button className="w-full bg-brand-700 text-white rounded-xl py-3 font-semibold hover:bg-brand-800">
					Calculate Another Tax
				</button>
			</div>
		</div>
	);
}

/* =================== */
/* SMALL COMPONENTS    */
/* =================== */

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="bg-slate-50 rounded-xl p-4">
			<p className="text-xs text-slate-500">{label}</p>
			<p className="font-semibold mt-1">₦{value.toLocaleString()}</p>
		</div>
	);
}

function Row({
	label,
	value,
	bold,
}: {
	label: string;
	value: number;
	bold?: boolean;
}) {
	return (
		<div className="flex justify-between">
			<span className={bold ? "font-semibold" : ""}>{label}</span>
			<span className={bold ? "font-semibold" : ""}>
				{value < 0 ? "-" : ""}₦{Math.abs(value).toLocaleString()}
			</span>
		</div>
	);
}
