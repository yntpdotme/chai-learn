import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/admin/courses/$courseId/")({
	component: CourseDetailPage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function CourseDetailPage() {
	const course = routeApi.useLoaderData();

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

			{course.lessons.length === 0 ? (
				<p className="mt-3 text-sm text-muted-foreground">No lessons yet.</p>
			) : (
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
			)}
		</div>
	);
}