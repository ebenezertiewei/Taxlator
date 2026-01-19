// src/api/endpoints.ts
export const ENDPOINTS = {
	// AUTH
	signup: "/api/auth/signup",
	signin: "/api/auth/signin",
	verifyEmail: "/api/auth/verifyEmail",
	sendVerificationCode: "/api/auth/sendVerificationCode",
	signout: "/api/auth/signout",
	me: "/api/auth/me",

	// CALCULATIONS
	taxCalculate: "/api/tax/calculate",
	vatCalculate: "/api/vat/calculate",
};
