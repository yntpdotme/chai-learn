import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { ApiError, api } from "#/lib/api";

export const Route = createFileRoute("/_public/lessons/$lessonId/")({
	loader: ({ params }) => api.lessons.get(params.lessonId),
	component: LessonPage,
});

function LessonPage() {
	const lesson = Route.useLoaderData();
	const [completed, setCompleted] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		// 401 (signed out) just means not completed — swallow it.
		api.progress
			.list()
			.then((rows) => {
				if (cancelled) return;
				setCompleted(rows.some((r) => r.lessonId === lesson.id && r.completed));
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [lesson.id]);

	async function markComplete() {
		setSaving(true);
		setError(null);
		try {
			const result = await api.progress.upsert({
				lessonId: lesson.id,
				completed: true,
			});
			setCompleted(result.completed);
		} catch (err) {
			setError(
				err instanceof ApiError && err.status === 401
					? "Sign in to track your progress."
					: "Couldn't save progress. Please try again.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="px-4 py-10">
			<h1 className="text-2xl font-semibold">{lesson.title}</h1>
			<div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">
				{lesson.content}
			</div>

			<Button
				className="mt-8"
				onClick={markComplete}
				disabled={completed || saving}
			>
				<CheckCircle2 className="mr-1.5 size-4" />
				{completed ? "Completed" : saving ? "Saving…" : "Mark complete"}
			</Button>

			{error && <p className="mt-3 text-sm text-destructive">{error}</p>}
		</main>
	);
}
