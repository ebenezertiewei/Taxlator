// src/state/auth.provider.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthCtx } from "./auth.context";
import type { AnyJson, SignInPayload, SignUpPayload, User } from "../api/types";

const API_BASE =
	import.meta.env.VITE_API_BASE_URL || "https://gov-taxlator-api.onrender.com";

axios.defaults.baseURL = API_BASE;

export function AuthProvider({ children }: { children: React.ReactNode }) {
	// ✅ NEW: real auth state
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Derived state (keeps compatibility)
	const authenticated = !!user;

	/* ---------------------------
	   Sync axios header from token
	---------------------------- */
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common.Authorization;
		}
	}, []);

	/* ---------------------------
	   Load current user on app start
	---------------------------- */
	const refresh = useCallback(async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setUser(null);
				return;
			}

			const res = await axios.get("/api/auth/me");
			setUser(res.data.user);
		} catch {
			// Token invalid / expired
			localStorage.removeItem("token");
			delete axios.defaults.headers.common.Authorization;
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	/* ---------------------------
	   Auth actions
	---------------------------- */
	const signin = useCallback(
		async (payload: SignInPayload): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/signin", payload, {
				headers: { "Content-Type": "application/json" },
			});

			if (res.data?.token) {
				localStorage.setItem("token", res.data.token);
				axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
				await refresh();
			}

			return res.data;
		},
		[refresh],
	);

	const signup = useCallback(
		async (payload: SignUpPayload): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/signup", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[],
	);

	const verifyEmail = useCallback(
		async (payload: { email: string; code: string }): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/verifyEmail", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[],
	);

	const sendVerificationCode = useCallback(
		async (payload: { email: string }): Promise<AnyJson> => {
			const res = await axios.post("/api/auth/sendVerificationCode", payload, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		[],
	);

	const signout = useCallback(async () => {
		try {
			await axios.post("/api/auth/signout", null);
		} catch {
			// ignore
		} finally {
			localStorage.removeItem("token");
			delete axios.defaults.headers.common.Authorization;
			setUser(null);
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common.Authorization;
		setUser(null);
	}, []);

	/* ---------------------------
	   Context value
	---------------------------- */
	const value = useMemo(
		() => ({
			user,
			loading,
			authenticated,
			signin,
			signup,
			verifyEmail,
			sendVerificationCode,
			signout,
			logout,
			refresh,
		}),
		[
			user,
			loading,
			authenticated,
			signin,
			signup,
			verifyEmail,
			sendVerificationCode,
			signout,
			logout,
			refresh,
		],
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
