// src/components/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/useAuth";
import React from "react";

type RequireAuthProps = {
	children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
	const { authenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-slate-600">
				Loading…
			</div>
		);
	}

	if (!authenticated) {
		return (
			<Navigate to="/signin" replace state={{ from: location.pathname }} />
		);
	}

	return <>{children}</>;
}
