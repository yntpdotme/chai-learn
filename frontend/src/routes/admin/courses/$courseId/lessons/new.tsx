import {
	createFileRoute,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { LessonForm } from "#/features/lessons/lesson-form";

export const Route = createFileRoute("/admin/courses/$courseId/lessons/new")({
	staticData: { breadcrumb: "New lesson" },
	component: NewLessonPage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function NewLessonPage() {
	const course = routeApi.useLoaderData();
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-2xl font-semibold">New lesson</h1>
			<p className="mt-1 text-sm text-muted-foreground">for {course.title}</p>
			<div className="mt-6">
				<LessonForm
					submitLabel="Create lesson"
					onSubmit={(value) => {
						// TODO: POST /api/admin/courses/:courseId/lessons — endpoint doesn't exist yet
						console.log("create lesson for course", course.id, value);
						navigate({
							to: "/admin/courses/$courseId",
							params: { courseId: course.id },
						});
					}}
				/>
			</div>
		</div>
	);
}
