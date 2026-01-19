// src/state/auth.provider.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
	api,
	clearToken,
	extractToken,
	getToken,
	setToken,
} from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import { AuthCtx } from "./auth.context";
import type { AuthContextValue } from "./auth.context";
import type { User } from "../api/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	/* ================= REFRESH USER ================= */
	const refresh = useCallback(async () => {
		const token = getToken();
		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}

		try {
			const { data } = await api.get(ENDPOINTS.me);
			setUser(data.user);
		} catch {
			clearToken();
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	/* ================= AUTO-REFRESH ON APP LOAD ================= */
	useEffect(() => {
		refresh();
	}, [refresh]);

	/* ================= CONTEXT VALUE ================= */
	const value = useMemo<AuthContextValue>(() => {
		const authenticated = Boolean(user);

		return {
			user,
			loading,
			authenticated,

			async signup(payload) {
				const { data } = await api.post(ENDPOINTS.signup, payload);
				return data;
			},

			async verifyEmail(payload) {
				const { data } = await api.post(ENDPOINTS.verifyEmail, payload);
				await refresh();
				return data;
			},

			async sendVerificationCode(payload) {
				const { data } = await api.post(
					ENDPOINTS.sendVerificationCode,
					payload,
				);
				return data;
			},

			async signin(payload) {
				const { data } = await api.post(ENDPOINTS.signin, payload);

				const token = extractToken(data);
				if (!token) {
					throw new Error("Signin succeeded but no token returned");
				}

				setToken(token);
				await refresh();
				return data;
			},

			async signout() {
				try {
					await api.post(ENDPOINTS.signout);
				} finally {
					clearToken();
					setUser(null);
				}
			},

			logout() {
				clearToken();
				setUser(null);
			},

			refresh,
		};
	}, [user, loading, refresh]);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
