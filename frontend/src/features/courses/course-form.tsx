import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { useRef } from "react";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "#/components/ui/form-fields";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import type { Course } from "#/lib/api";

const courseSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	slug: z
		.string()
		.min(2, "Slug must be at least 2 characters")
		.regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
	description: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

function fieldError(schema: z.ZodTypeAny, value: unknown) {
	return schema.safeParse(value).error?.issues[0]?.message;
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export function CourseForm({
	defaultValues,
	onSubmit,
	submitLabel = "Save course",
}: {
	defaultValues?: Partial<Pick<Course, "title" | "slug" | "description">>;
	onSubmit: (value: CourseFormValues) => void | Promise<void>;
	submitLabel?: string;
}) {
	const slugTouched = useRef(Boolean(defaultValues?.slug));

	const form = useForm({
		defaultValues: {
			title: defaultValues?.title ?? "",
			slug: defaultValues?.slug ?? "",
			description: defaultValues?.description ?? "",
		},
		onSubmit: async ({ value }) => {
			await onSubmit(courseSchema.parse(value));
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
			className="max-w-lg space-y-4"
		>
			<form.Field
				name="title"
				validators={{
					onChange: ({ value }) => fieldError(courseSchema.shape.title, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Title
						</FormLabel>
						<Input
							id={field.name}
							value={field.state.value}
							onChange={(e) => {
								field.handleChange(e.target.value);
								if (!slugTouched.current)
									form.setFieldValue("slug", slugify(e.target.value));
							}}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="Linux Fundamentals"
							autoFocus
						/>
						<FormMessage errors={field.state.meta.errors} label="Title" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="slug"
				validators={{
					onChange: ({ value }) => fieldError(courseSchema.shape.slug, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Slug
						</FormLabel>
						<Input
							id={field.name}
							value={field.state.value}
							onChange={(e) => {
								slugTouched.current = true;
								field.handleChange(slugify(e.target.value));
							}}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="linux-fundamentals"
						/>
						<FormMessage errors={field.state.meta.errors} label="Slug" />
					</FormItem>
				)}
			</form.Field>

			<form.Field name="description">
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name}>Description</FormLabel>
						<Textarea
							id={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							placeholder="What will students learn in this course?"
							rows={4}
						/>
					</FormItem>
				)}
			</form.Field>

			<Button type="submit" disabled={!canSubmit || isSubmitting}>
				{isSubmitting ? "Saving…" : submitLabel}
			</Button>
		</form>
	);
}
