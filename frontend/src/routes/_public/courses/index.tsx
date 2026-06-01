import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { api } from "#/lib/api";

export const Route = createFileRoute("/_public/courses/")({
	loader: () => api.courses.list(),
	component: CoursesPage,
});

function CoursesPage() {
	const courses = Route.useLoaderData();

	return (
		<main className="px-4 py-10">
			<h1 className="text-2xl font-semibold">Courses</h1>

			{courses.length === 0 ? (
				<p className="mt-6 text-muted-foreground">
					No courses yet - check back soon.
				</p>
			) : (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{courses.map((course) => (
						<Link
							key={course.id}
							to="/courses/$courseId"
							params={{ courseId: course.id }}
						>
							<Card className="transition-colors hover:bg-accent/50">
								<CardHeader>
									<CardTitle>{course.title}</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">
									{course.description}
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</main>
	);
}
