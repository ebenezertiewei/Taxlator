// taxlator/src/pages/tax/CompanyResultPanel.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function formatNaira(value: unknown) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return "₦0.00";
	return `₦${n.toLocaleString("en-NG", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function toFiniteNumber(v: unknown, fallback = 0) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}

type CompanyResult = {
	taxPayable?: number;
	taxRate?: number;
	profit?: number;
	profitAfterTax?: number;
	revenue?: number;
	expenses?: number;
	companySize?: string;
};

type Props = {
	result: unknown;
	revenue: number;
	expenses: number;
	companySize?: string;
	isAuthenticated: boolean;
	prefillEmail?: string;
};

function companySizeLabel(size?: string) {
	if (size === "SMALL") return "Small Company";
	if (size === "MEDIUM") return "Medium Company";
	if (size === "LARGE") return "Large Company";
	return "—";
}

export default function CompanyResultPanel({
	result,
	revenue,
	expenses,
	companySize,
	isAuthenticated,
	prefillEmail = "",
}: Props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(prefillEmail);

	const r = useMemo(() => (result ?? {}) as CompanyResult, [result]);

	const taxDue = toFiniteNumber(r.taxPayable ?? 0);
	const annualRevenue = toFiniteNumber(r.revenue ?? revenue);
	const businessExpenses = toFiniteNumber(r.expenses ?? expenses);

	const profit = toFiniteNumber(
		r.profit ?? Math.max(0, annualRevenue - businessExpenses),
	);

	const profitAfterTax = toFiniteNumber(r.profitAfterTax ?? profit - taxDue);

	const effectiveCompanySize = r.companySize ?? companySize;

	const taxRatePct =
		typeof r.taxRate === "number"
			? `${Math.round(r.taxRate * 100)}%`
			: effectiveCompanySize === "SMALL"
				? "0%"
				: effectiveCompanySize === "MEDIUM"
					? "20%"
					: effectiveCompanySize === "LARGE"
						? "30%"
						: "—";

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* HEADER */}
			<div className="p-3 text-center border-b">
				<div className="text-sm text-slate-600">
					Company Income Tax (CIT) Result
				</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(taxDue)}
				</div>
				<div className="text-sm text-slate-600 mt-1">Total Tax Due</div>

				<div className="mt-1 text-xs text-slate-600">
					Company Size:{" "}
					<span className="font-semibold text-slate-800">
						{companySizeLabel(effectiveCompanySize)}
					</span>
				</div>
			</div>

			{/* SUMMARY CARDS */}
			<div className="p-3">
				<div className="grid grid-cols-2 gap-2">
					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">Revenue</div>
						<div className="mt-1 font-semibold text-sm sm:text-base break-all text-center max-w-full">
							{formatNaira(annualRevenue)}
						</div>
					</div>

					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">
							Profit After Tax
						</div>
						<div className="mt-1 font-semibold text-sm sm:text-base break-all text-center max-w-full">
							{formatNaira(profitAfterTax)}
						</div>
					</div>
				</div>

				{/* ACCORDION TRIGGER */}
				<button
					type="button"
					onClick={() => setOpen((s) => !s)}
					className="mt-5 w-full flex items-center justify-between rounded-2xl bg-slate-50 border px-2 py-4 text-sm font-semibold"
				>
					<span>View Tax Breakdown</span>
					<span className="text-slate-500">{open ? "▴" : "▾"}</span>
				</button>

				{/* BREAKDOWN */}
				{open && (
					<div className="mt-4 rounded-2xl border bg-slate-50 py-4 px-2 w-full">
						<div className="text-brand-800 font-semibold">
							Tax Calculation Breakdown
						</div>

						<div className="mt-3 space-y-1 text-xs text-slate-700">
							<div className="flex justify-between gap-3">
								<div className="flex-1 break-words">Revenue</div>
								<div className="font-medium whitespace-nowrap">
									{formatNaira(annualRevenue)}
								</div>
							</div>

							<div className="flex justify-between gap-3">
								<div className="flex-1 break-words">Business Expenses</div>
								<div className="font-medium whitespace-nowrap">
									-{formatNaira(businessExpenses)}
								</div>
							</div>
						</div>

						<hr className="my-3" />

						<div className="flex justify-between text-xs text-slate-700">
							<div className="font-semibold">Taxable Profit</div>
							<div className="font-semibold">{formatNaira(profit)}</div>
						</div>

						<div className="flex justify-between text-xs text-slate-700 mt-1">
							<div className="font-semibold">
								Company Income Tax ({taxRatePct})
							</div>
							<div className="font-semibold">{formatNaira(taxDue)}</div>
						</div>

						<hr className="my-4" />

						<div className="flex justify-between text-xs text-slate-700">
							<div>Total Annual Tax</div>
							<div className="font-semibold">{formatNaira(taxDue)}</div>
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

				{/* GUEST ONLY CTA */}
				{!isAuthenticated && (
					<div className="mt-6 rounded-2xl border bg-[#93a7ca] py-4 px-2">
						<div className="text-sm font-semibold text-slate-900">
							Save Your Calculations
						</div>
						<div className="text-xs text-slate-600 mt-1">
							Create a free account to save your tax calculations, track
							history, and get reminders.
						</div>

						<div className="mt-4 flex gap-3">
							<div className="flex-1">
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded border px-3 py-2 text-sm bg-white"
									placeholder="Enter your email"
									type="email"
								/>
							</div>
							<Link
								to="/signup"
								state={{ email }}
								className="px-6 rounded bg-brand-800 text-white text-sm font-semibold grid place-items-center hover:bg-brand-900"
							>
								Sign Up
							</Link>
						</div>

						<Link
							to="/calculate"
							className="inline-block mt-3 text-xs text-slate-700 hover:text-brand-800"
						>
							Continue as guest
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
