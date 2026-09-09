import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { useState } from "react";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "#/components/ui/form-fields";
import { Input } from "#/components/ui/input";
import { PasswordInput } from "#/components/ui/password-input";
import { authClient } from "#/lib/auth-client";

const signupSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function fieldError(schema: z.ZodTypeAny, value: unknown) {
	return schema.safeParse(value).error?.issues[0]?.message;
}

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formError, setFormError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
		onSubmit: async ({ value }) => {
			setFormError(null);
			const { error } = await authClient.signUp.email({
				name: value.name,
				email: value.email,
				password: value.password,
			});
			if (error) {
				setFormError(error.message ?? "Could not create your account");
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
				name="name"
				validators={{
					onChange: ({ value }) => fieldError(signupSchema.shape.name, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Full name
						</FormLabel>
						<Input
							id={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="Akash Kadlag "
							autoFocus
						/>
						<FormMessage errors={field.state.meta.errors} label="Name" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="email"
				validators={{
					onChange: ({ value }) => fieldError(signupSchema.shape.email, value),
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
						/>
						<FormMessage errors={field.state.meta.errors} label="Email" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="password"
				validators={{
					onChange: ({ value }) =>
						fieldError(signupSchema.shape.password, value),
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
							placeholder="At least 8 characters"
						/>
						<FormMessage errors={field.state.meta.errors} label="Password" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="confirmPassword"
				validators={{
					onChangeListenTo: ["password"],
					onChange: ({ value, fieldApi }) =>
						value !== fieldApi.form.getFieldValue("password")
							? "Passwords do not match"
							: undefined,
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Confirm password
						</FormLabel>
						<PasswordInput
							id={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="Re-enter your password"
						/>
						<FormMessage
							errors={field.state.meta.errors}
							label="Confirm password"
						/>
					</FormItem>
				)}
			</form.Field>

			{formError && <p className="text-sm text-destructive">{formError}</p>}

			<Button
				type="submit"
				disabled={!canSubmit || isSubmitting}
				className="w-full"
			>
				{isSubmitting ? "Creating account…" : "Create account"}
			</Button>
		</form>
	);
}
