import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { mockCourses } from "#/features/admin/mock-data";

export const Route = createFileRoute("/admin/courses/$courseId/")({
	loader: ({ params }) => {
		const course = mockCourses.find((c) => c.id === params.courseId);
		if (!course) throw notFound();
		return course;
	},
	component: CourseDetailPage,
});

function CourseDetailPage() {
	const course = Route.useLoaderData();

	return (
		<div>
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{course.title}</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{course.description}
					</p>
				</div>
				<Button
					variant="outline"
					render={
						<Link
							to="/admin/courses/$courseId/edit"
							params={{ courseId: course.id }}
						/>
					}
				>
					<Pencil className="mr-1.5 size-4" />
					Edit
				</Button>
			</div>

			<div className="mt-8 flex items-center justify-between">
				<h2 className="font-medium">Lessons</h2>
				<Button
					size="sm"
					variant="ghost"
					render={
						<Link
							to="/admin/courses/$courseId/lessons/new"
							params={{ courseId: course.id }}
						/>
					}
				>
					<Plus className="mr-1.5 size-4" />
					Add lesson
				</Button>
			</div>

			<ul className="mt-3 divide-y rounded-md border">
				{course.lessons.map((lesson) => (
					<li
						key={lesson.id}
						className="flex items-center justify-between px-4 py-3"
					>
						<span className="text-sm">
							<span className="mr-2 text-muted-foreground">
								{lesson.order}.
							</span>
							{lesson.title}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
