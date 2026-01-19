// taxlator/src/pages/tax/FreelancerResultPanel.tsx
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

/* =======================
   TYPES
======================= */

type TaxBand = {
	rate: number;
	taxableAmount: number;
	tax: number;
};

type FreelancerResult = {
	totalAnnualTax?: number;
	monthlyTax?: number;
	annualGrossIncome?: number;
	taxableIncome?: number;
	expenses?: number;
	pension?: number;
	breakdown?: TaxBand[];
};

type Props = {
	result: unknown;
	grossIncome: number;
	isAuthenticated: boolean;
	prefillEmail?: string;
};

export default function FreelancerResultPanel({
	result,
	grossIncome,
	isAuthenticated,
	prefillEmail = "",
}: Props) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(prefillEmail);

	/* =======================
	   NORMALIZE RESULT
	======================= */
	const r = useMemo(() => (result ?? {}) as FreelancerResult, [result]);

	const taxDue = r.totalAnnualTax ?? 0;

	const annualGrossIncome = r.annualGrossIncome ?? grossIncome;

	const netIncome =
		typeof taxDue === "number" ? annualGrossIncome - taxDue : annualGrossIncome;

	const deductions = {
		Expenses: r.expenses ?? 0,
		Pension: r.pension ?? 0,
	};

	const totalDeductions = (Number(r.expenses) || 0) + (Number(r.pension) || 0);

	const taxableIncome =
		typeof r.taxableIncome === "number"
			? r.taxableIncome
			: annualGrossIncome - totalDeductions;

	const breakdown: TaxBand[] = Array.isArray(r.breakdown) ? r.breakdown : [];

	return (
		<div className="bg-white rounded-2xl border shadow-soft overflow-hidden">
			{/* HEADER */}
			<div className="p-3 text-center border-b">
				<div className="text-sm text-slate-600">
					Freelancer / Self-Employed Result
				</div>
				<div className="mt-2 text-3xl font-extrabold text-brand-800">
					{formatNaira(taxDue)}
				</div>
				<div className="text-sm text-slate-600 mt-1">Total Tax Due</div>
			</div>

			{/* SUMMARY */}
			<div className="p-3">
				<div className="grid grid-cols-2 gap-2">
					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">
							Gross Income
						</div>
						<div className="mt-1 font-semibold text-sm break-all text-center">
							{formatNaira(annualGrossIncome)}
						</div>
					</div>

					<div className="rounded-2xl bg-slate-50 border py-4 px-2">
						<div className="text-xs text-slate-600 text-center">Net Income</div>
						<div className="mt-1 font-semibold text-sm break-all text-center">
							{formatNaira(netIncome)}
						</div>
					</div>
				</div>

				{/* ACCORDION */}
				<button
					type="button"
					onClick={() => setOpen((s) => !s)}
					className="mt-5 w-full flex items-center justify-between rounded-2xl bg-slate-50 border px-2 py-4 text-sm font-semibold"
				>
					<span>View Tax Breakdown</span>
					<span className="text-slate-500">{open ? "▴" : "▾"}</span>
				</button>

				{open && (
					<div className="mt-4 rounded-2xl border bg-slate-50 py-4 px-2">
						<div className="text-brand-800 font-semibold">
							Tax Calculation Breakdown
						</div>

						{/* DEDUCTIONS */}
						<div className="mt-3 space-y-1 text-xs text-slate-700">
							{Object.entries(deductions).map(([k, v]) => (
								<div key={k} className="flex justify-between gap-3">
									<div className="flex-1 break-words">{k}</div>
									<div className="font-medium whitespace-nowrap">
										{formatNaira(v)}
									</div>
								</div>
							))}
						</div>

						<hr className="my-3" />

						<div className="flex justify-between text-xs text-slate-700">
							<div className="font-semibold">Total Deductions</div>
							<div className="font-semibold">
								{formatNaira(totalDeductions)}
							</div>
						</div>

						<div className="flex justify-between text-xs text-slate-700 mt-1">
							<div className="font-semibold">Taxable Income</div>
							<div className="font-semibold">{formatNaira(taxableIncome)}</div>
						</div>

						{/* PROGRESSIVE TAX BANDS (ANNUAL) */}
						{breakdown.length > 0 && (
							<>
								<hr className="my-4" />

								<div className="text-xs font-bold text-slate-700">
									Progressive Tax Band (Annual)
								</div>

								<div className="mt-2 space-y-1 text-xs text-slate-700">
									{breakdown.map((b, idx) => (
										<div key={idx} className="flex justify-between gap-3">
											<div className="flex-1 break-words">
												{/* Mobile */}
												<span className="sm:hidden">
													Band {idx + 1} ({Math.round(b.rate * 100)}%)
												</span>

												{/* Desktop */}
												<span className="hidden sm:inline">
													{Math.round(b.rate * 100)}% on{" "}
													{formatNaira(b.taxableAmount)}
												</span>
											</div>

											<div className="font-medium whitespace-nowrap">
												{formatNaira(b.tax)}
											</div>
										</div>
									))}
								</div>
							</>
						)}

						<hr className="my-4" />

						<div className="flex justify-between text-xs text-slate-700">
							<div>Total Annual Tax</div>
							<div className="font-semibold">{formatNaira(taxDue)}</div>
						</div>

						<div className="flex justify-between text-xs text-slate-700 mt-1">
							<div>Monthly Tax</div>
							<div className="font-semibold">
								{formatNaira(r.monthlyTax ?? taxDue / 12)}
							</div>
						</div>
					</div>
				)}

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
