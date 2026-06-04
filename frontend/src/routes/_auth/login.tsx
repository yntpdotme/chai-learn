import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "#/features/auth/login-form";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();

	return (
		<main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center px-4">
			<h1 className="text-2xl font-semibold">Sign in</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Use your ChaiLearn account to continue.
			</p>
			<div className="mt-6">
				<LoginForm onSuccess={() => navigate({ to: redirect || "/" })} />
			</div>
		</main>
	);
}
