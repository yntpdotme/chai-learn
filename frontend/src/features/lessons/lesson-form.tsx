import { useForm } from "@tanstack/react-form";
import { useSelector } from "@tanstack/react-store";
import { z } from "zod";
import { FormItem, FormLabel, FormMessage } from "#/components/ui/form-fields";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

const lessonSchema = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	content: z.string().min(1, "Content is required"),
	order: z.number().int().min(1, "Order must be at least 1"),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

function fieldError(schema: z.ZodTypeAny, value: unknown) {
	return schema.safeParse(value).error?.issues[0]?.message;
}

export function LessonForm({
	defaultValues,
	onSubmit,
	submitLabel = "Save lesson",
}: {
	defaultValues?: Partial<LessonFormValues>;
	onSubmit: (value: LessonFormValues) => void | Promise<void>;
	submitLabel?: string;
}) {
	const form = useForm({
		defaultValues: {
			title: defaultValues?.title ?? "",
			content: defaultValues?.content ?? "",
			order: defaultValues?.order ?? 1,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(lessonSchema.parse(value));
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
					onChange: ({ value }) => fieldError(lessonSchema.shape.title, value),
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
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="Intro to the Shell"
							autoFocus
						/>
						<FormMessage errors={field.state.meta.errors} label="Title" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="order"
				validators={{
					onChange: ({ value }) => fieldError(lessonSchema.shape.order, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Order
						</FormLabel>
						<Input
							id={field.name}
							type="number"
							min={1}
							value={field.state.value}
							onChange={(e) => field.handleChange(Number(e.target.value))}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							className="max-w-24"
						/>
						<FormMessage errors={field.state.meta.errors} label="Order" />
					</FormItem>
				)}
			</form.Field>

			<form.Field
				name="content"
				validators={{
					onChange: ({ value }) =>
						fieldError(lessonSchema.shape.content, value),
				}}
			>
				{(field) => (
					<FormItem>
						<FormLabel htmlFor={field.name} required>
							Content
						</FormLabel>
						<Textarea
							id={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							aria-invalid={field.state.meta.errors.length > 0}
							placeholder="Lesson content..."
							rows={8}
						/>
						<FormMessage errors={field.state.meta.errors} label="Content" />
					</FormItem>
				)}
			</form.Field>

			<Button type="submit" disabled={!canSubmit || isSubmitting}>
				{isSubmitting ? "Saving…" : submitLabel}
			</Button>
		</form>
	);
}