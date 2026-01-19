// src/state/auth.context.ts
import { createContext, useContext } from "react";
import type { AnyJson, SignInPayload, SignUpPayload, User } from "../api/types";

export type AuthContextValue = {
	user: User | null;
	loading: boolean;
	authenticated: boolean;

	signin: (payload: SignInPayload) => Promise<AnyJson>;
	signup: (payload: SignUpPayload) => Promise<AnyJson>;
	verifyEmail: (payload: { email: string; code: string }) => Promise<AnyJson>;
	sendVerificationCode: (payload: { email: string }) => Promise<AnyJson>;
	signout: () => Promise<void>;
	logout: () => void;

	refresh: () => Promise<void>;
};

export const AuthCtx = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthCtx);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
}
