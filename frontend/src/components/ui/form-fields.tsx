// Path: apps/web/src/components/ui/form-fields.tsx
import { Label } from "#/components/ui/label";
import { cn } from "#/lib/utils";
import type * as React from "react";

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("space-y-2.5", className)} {...props} />;
}

export function FormLabel({
	className,
	required,
	children,
	...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
	return (
		<Label className={cn(className)} {...props}>
			{children}
			{required && (
				<span className="text-destructive -ml-1.5" aria-hidden="true">
					*
				</span>
			)}
		</Label>
	);
}

export function FormDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p className={cn("text-xs text-muted-foreground", className)} {...props} />
	);
}

export function humanizeError(
	rawMessage: unknown,
	fieldLabel?: string,
): string {
	const label = fieldLabel ?? "This field";
	const message = String(rawMessage ?? "").trim();

	if (message.startsWith("[") || message.startsWith("{")) {
		try {
			const parsed = JSON.parse(message);
			const issues = Array.isArray(parsed) ? parsed : [parsed];
			const first = issues[0];

			if (first?.format === "date" || /date/i.test(first?.path?.at(-1) ?? "")) {
				return `${label} must be a valid date.`;
			}
			if (typeof first?.message === "string") {
				return humanizeError(first.message, label);
			}
		} catch {
			// not JSON — fall through to the existing string-based heuristics
		}
	}
	if (!message) return `${label} is invalid.`;

	let match = message.match(/Too small: expected string to have >=(\d+)/i);
	if (match) {
		return `${label} must be at least ${match[1]} character${match[1] === "1" ? "" : "s"}.`;
	}

	match = message.match(/Too big: expected string to have <=(\d+)/i);
	if (match) {
		return `${label} must be at most ${match[1]} character${match[1] === "1" ? "" : "s"}.`;
	}

	match = message.match(/Too small: expected number to be >=(\d+)/i);
	if (match) return `${label} must be at least ${match[1]}.`;

	match = message.match(/Too big: expected number to be <=(\d+)/i);
	if (match) return `${label} must be at most ${match[1]}.`;

	if (/invalid_type|expected string, received/i.test(message)) {
		return `${label} is required.`;
	}

	if (/invalid email/i.test(message)) {
		return "Enter a valid email address.";
	}

	if (/invalid.*url/i.test(message)) {
		return "Enter a valid URL.";
	}

	match = message.match(
		/duplicate key value violates unique constraint "([^"]+)"/i,
	);
	if (match) {
		const constraintName = match[1];
		const columnGuess = constraintName
			.replace(/^.*?_/, "")
			.replace(/_unique$|_key$|_idx$/, "")
			.replace(/_/g, " ");

		if (columnGuess && columnGuess !== constraintName) {
			return `This ${columnGuess} is already taken. Please choose a different one.`;
		}
		return "This value is already in use. Please choose a different one.";
	}

	if (/foreign key constraint/i.test(message)) {
		return "This action can\u2019t be completed because related data still references it.";
	}

	if (
		/failed query/i.test(message) ||
		/^insert into|^update |^select /i.test(message)
	) {
		return "Something went wrong while saving. Please try again.";
	}

	return message.replace(/^Invalid input:\s*/i, "") || `${label} is invalid.`;
}

export function FormMessage({
	errors,
	className,
	label,
}: {
	errors: unknown[];
	className?: string;
	label?: string;
}) {
	const first = errors.find(Boolean);
	if (!first) return null;
	return (
		<p className={cn("text-xs text-destructive", className)}>
			{humanizeError(first, label)}
		</p>
	);
}
