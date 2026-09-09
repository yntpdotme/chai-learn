import {
	createFileRoute,
	getRouteApi,
	Link,
	useRouter,
} from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { ConfirmDeleteDialog } from "#/components/confirm-delete-dialog";
import { Button } from "#/components/ui/button";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/$courseId/")({
	component: CourseDetailPage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function CourseDetailPage() {
	const course = routeApi.useLoaderData();
	const router = useRouter();

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

							<ConfirmDeleteDialog
								title={`Delete "${lesson.title}"?`}
								description="This permanently deletes the lesson and any student progress on it. This can't be undone."
								onConfirm={async () => {
									await api.admin.lessons.delete(lesson.id);
									await router.invalidate();
								}}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
