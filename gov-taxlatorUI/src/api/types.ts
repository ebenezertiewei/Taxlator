// taxlator/src/api/types.ts

/* ===============================
   AUTH TYPES
================================ */

export type SignUpPayload = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type SignInPayload = {
	email: string;
	password: string;
};

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

/* ===============================
   SHARED TAX TYPES
================================ */

export type TaxType = "PAYE/PIT" | "FREELANCER" | "CIT" | "VAT";
export type Frequency = "monthly" | "annual";

/* ===============================
   PAYE / PIT
================================ */

export type PayePitCalculatePayload = {
	taxType: "PAYE/PIT";
	grossIncome: number;
	frequency?: Frequency;
	rentRelief?: number;
	otherDeductions?: number;
};

export type PayeDeduction = {
	key: string;
	label: string;
	amount: number;
	rate?: number;
	base?: number;
	enabled?: boolean;
};

export type PayeTaxBand = {
	rate: number;
	taxableAmount: number;
	tax: number;
};

export type PayeResult = {
	taxType: "PAYE/PIT";
	frequency: Frequency;

	grossIncome: number;

	// Consolidated Relief Allowance
	cra: number;

	deductions: PayeDeduction[];
	totalDeductions: number;

	taxableIncome: number;
	totalTax: number;
	netIncome: number;
	effectiveTaxRate: number;

	computation: PayeTaxBand[];
};

/* ===============================
   FREELANCER
================================ */

export type FreelancerCalculatePayload = {
	taxType: "FREELANCER";
	grossIncome: number;
	frequency?: Frequency;
	expenses?: number;
	pension?: number;
};

/* ===============================
   COMPANY INCOME TAX (CIT)
================================ */

/**
 * ⚠️ SINGLE SOURCE OF TRUTH
 * Do NOT redefine this anywhere else
 */
export type CompanySize = "SMALL" | "MEDIUM" | "LARGE" | "MULTINATIONAL";

export type CitCalculatePayload = {
	taxType: "CIT";
	annualTurnover: number;
	fixedAssets: number;
	taxableProfit: number;
	accountingProfit?: number; // only for multinationals
	companySize: CompanySize;
};

export type CitResult = {
	companySize: CompanySize;
	taxableProfit: number;
	appliedRate: number; // e.g. 0.3
	totalTax: number;
	netProfitAfterTax: number;
	minimumTaxApplied?: boolean;
};

/* ===============================
   VAT
================================ */

export type VatCalculationType = "add" | "remove";

export type VatTransactionType =
	| "Domestic sale/Purchase"
	| "Digital Services"
	| "Export/International"
	| "Exempt";

export type VatCalculatePayload = {
	transactionAmount: number;
	calculationType: VatCalculationType;
	transactionType: VatTransactionType;
};

/* ===============================
   UNION PAYLOAD
================================ */

export type TaxCalculatePayload =
	| PayePitCalculatePayload
	| FreelancerCalculatePayload
	| CitCalculatePayload
	| VatCalculatePayload;

/* ===============================
   HISTORY
================================ */

export type HistoryItem = {
	_id?: string;
	type: TaxType;
	input: Record<string, unknown>;
	result: Record<string, unknown>;
	createdAt: string | Date;
};

/* ===============================
   JSON SAFE HELPERS
================================ */

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| { [key: string]: JsonValue };

export type AnyJson = Record<string, unknown>;
