import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "#/lib/api";

export const Route = createFileRoute("/_public/courses/$courseId/")({
	loader: ({ params }) => api.courses.get(params.courseId),
	component: CourseDetailPage,
});

function CourseDetailPage() {
	const course = Route.useLoaderData();

	return (
		<main className="mx-auto px-4 py-10">
			<h1 className="text-2xl font-semibold">{course.title}</h1>
			<p className="mt-2 text-muted-foreground">{course.description}</p>

			<ul className="mt-8 divide-y rounded-md border">
				{course.lessons.map((lesson) => (
					<li key={lesson.id}>
						<Link
							to="/lessons/$lessonId"
							params={{ lessonId: lesson.id }}
							className="flex items-center justify-between px-4 py-3 hover:bg-accent/50"
						>
							<span className="text-sm">
								<span className="mr-2 text-muted-foreground">
									{lesson.order}.
								</span>
								{lesson.title}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
