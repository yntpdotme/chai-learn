import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "#/lib/api";

export const Route = createFileRoute("/_public/courses/$courseId/")({
	loader: ({ params }) => api.courses.get(params.courseId),
	component: CourseDetailPage,
});

function CourseDetailPage() {
	const course = Route.useLoaderData();
	const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		let cancelled = false;
		// 401 (signed out) just means nothing is completed — swallow it.
		api.progress
			.list()
			.then((rows) => {
				if (cancelled) return;
				setCompletedIds(
					new Set(rows.filter((r) => r.completed).map((r) => r.lessonId)),
				);
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<main className="mx-auto px-4 py-10">
			<h1 className="text-2xl font-semibold">{course.title}</h1>
			<p className="mt-2 text-muted-foreground">{course.description}</p>

			<ul className="mt-8 divide-y rounded-md border">
				{course.lessons.map((lesson) => {
					const completed = completedIds.has(lesson.id);
					return (
						<li key={lesson.id}>
							<Link
								to="/lessons/$lessonId"
								params={{ lessonId: lesson.id }}
								className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
							>
								<span className="text-sm">
									<span className="mr-2 text-muted-foreground">
										{lesson.order}.
									</span>
									{lesson.title}
								</span>
								{completed && (
									<span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
										<CheckCircle2 className="size-4" />
										Completed
									</span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
		</main>
	);
}
