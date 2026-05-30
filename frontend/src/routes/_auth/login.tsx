import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "#/features/auth/login-form";

export const Route = createFileRoute("/_auth/login")({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	return (
		<main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center px-4">
			<h1 className="text-2xl font-semibold">Sign In</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Use your ChaiLearn account to continue.
			</p>
			<div className="mt-6">
				<LoginForm onSuccess={() => navigate({ to: "/" })} />
			</div>

			<p className="text-sm text-muted-foreground mt-6">
				New here?{" "}
				<Link
					to="/signup"
					className="text-primary underline-offset-4 hover:underline"
				>
					Create an account
				</Link>
			</p>
		</main>
	);
}
