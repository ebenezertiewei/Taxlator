import { useState } from "react";
import type { CitResult, CompanySize } from "../../api/types";
import { formatCurrency } from "../../utils/formatCurrency";

export type CompanyResultPanelProps = {
	result: CitResult;
	companySize?: CompanySize;
	isAuthenticated: boolean;
};

export default function CompanyResultPanel({
	result,
	companySize,
}: CompanyResultPanelProps) {
	const [open, setOpen] = useState(false);

	const {
		taxableProfit,
		appliedRate,
		totalTax,
		netProfitAfterTax,
		minimumTaxApplied,
	} = result;

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="text-center">
				<p className="text-sm text-slate-600">Company Income Tax</p>
				<h2 className="text-2xl font-bold text-brand-800">
					{formatCurrency(totalTax)}
				</h2>
				<p className="text-xs text-slate-500">Total Tax Due</p>
			</div>

			<hr className="my-4" />

			<div className="grid grid-cols-2 gap-3">
				<Card label="Taxable Profit" value={formatCurrency(taxableProfit)} />
				<Card label="Net Profit" value={formatCurrency(netProfitAfterTax)} />
			</div>

			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="mt-4 w-full bg-slate-50 rounded-lg py-3 text-sm font-medium"
			>
				{open ? "Hide Breakdown ▲" : "View Breakdown ▼"}
			</button>

			{open && (
				<div className="mt-4 border rounded-lg p-4 text-sm space-y-2">
					<Row label="Company Size" value={companySize ?? "-"} />
					<Row label="Applied Rate" value={`${appliedRate * 100}%`} />
					<Row
						label="Normal CIT"
						value={formatCurrency(taxableProfit * appliedRate)}
					/>

					{minimumTaxApplied && <Row label="Minimum Tax" value="Applied" />}

					<hr />

					<Row
						label="Final Tax Payable"
						value={formatCurrency(totalTax)}
						strong
					/>
				</div>
			)}
		</div>
	);
}

function Card({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-slate-50 rounded-lg p-3">
			<p className="text-xs text-slate-500">{label}</p>
			<p className="font-semibold">{value}</p>
		</div>
	);
}

function Row({
	label,
	value,
	strong,
}: {
	label: string;
	value: string;
	strong?: boolean;
}) {
	return (
		<div className="flex justify-between">
			<span className="text-slate-600">{label}</span>
			<span className={strong ? "font-semibold" : ""}>{value}</span>
		</div>
	);
}
