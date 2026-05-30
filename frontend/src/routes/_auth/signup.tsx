import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SignupForm } from "#/features/auth/signup-form";

export const Route = createFileRoute("/_auth/signup")({
	component: SignupPage,
});

function SignupPage() {
	const navigate = useNavigate();
	return (
		<main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center px-4">
			<h1 className="text-2xl font-semibold">Sign Up</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Start your journey by creating account.
			</p>

			<div className="mt-6">
				<SignupForm onSuccess={() => navigate({ to: "/" })} />
			</div>

			<p className="mt-6 text-sm text-muted-foreground">
				Already have one?{" "}
				<Link
					to="/login"
					className="text-primary underline-offset-4 hover:underline"
				>
					Sign in
				</Link>
			</p>
		</main>
	);
}
