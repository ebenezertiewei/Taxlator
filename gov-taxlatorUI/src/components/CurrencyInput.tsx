import { onlyNumbers, formatNumber } from "../utils/numberInput";

type Props = {
	id?: string;
	label?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export default function CurrencyInput({
	id,
	label,
	value,
	onChange,
	placeholder = "0",
}: Props) {
	return (
		<div className="space-y-1">
			{label && (
				<label htmlFor={id} className="text-sm font-bold text-slate-700">
					{label}
				</label>
			)}

			<div className="relative">
				<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
					₦
				</span>

				<input
					id={id}
					className="w-full box-border rounded border pl-8 pr-3 py-2 text-base sm:text-sm
						focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
					value={formatNumber(value)}
					onChange={(e) => onChange(onlyNumbers(e.target.value))}
					placeholder={placeholder}
					inputMode="numeric"
				/>
			</div>
		</div>
	);
}
