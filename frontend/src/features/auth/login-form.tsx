import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "#/components/ui/form-fields";
import { Input } from "#/components/ui/input";
import { authClient } from "#/lib/auth-client";
import { PasswordInput } from "#/components/ui/password-input";

const loginSchema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function fieldError(schema: z.ZodTypeAny, value: unknown) {
	return schema.safeParse(value).error?.issues[0]?.message;
}

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formError, setFormError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setFormError(null);
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
			});
			if (error) {
				setFormError(error.message ?? "Invalid email or password");
				return;
			}
			onSuccess?.();
		},
	});

	const canSubmit = useSelector(form.store, (s) => s.canSubmit);
	const isSubmitting = useSelector(form.store, (s) => s.isSubmitting);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field
				name="email"
				validators={{
					onChange: ({ value }) => fieldError(loginSchema.shape.email, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Email
						</FormLabel>
						<Input
							id={field.name}
							type="email"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="you@example.com"
							autoFocus
						/>
						<FormMessage errors={field.state.meta.errors} label="Email" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="password"
				validators={{
					onChange: ({ value }) =>
						fieldError(loginSchema.shape.password, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Password
						</FormLabel>
						<PasswordInput
							id={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="••••••••"
						/>
						<FormMessage errors={field.state.meta.errors} label="Password" />
					</FormItem>
				)}
			</form.Field>

			{formError && <p className="text-sm text-destructive">{formError}</p>}

			<Button
				type="submit"
				disabled={!canSubmit || isSubmitting}
				className="w-full"
			>
				{isSubmitting ? "Signing in…" : "Sign in"}
			</Button>
		</form>
	);
}
