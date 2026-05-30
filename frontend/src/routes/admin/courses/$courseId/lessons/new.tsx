import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LessonForm } from "#/features/lessons/lesson-form";

export const Route = createFileRoute("/admin/courses/$courseId/lessons/new")({
	staticData: { breadcrumb: "New lesson" },
	component: NewLessonPage,
});

function NewLessonPage() {
	const { courseId } = Route.useParams();
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-2xl font-semibold">New lesson</h1>
			<div className="mt-6">
				<LessonForm
					submitLabel="Create lesson"
					onSubmit={(value) => {
						// TODO Phase 6: POST /api/admin/courses/:courseId/lessons
						console.log("create lesson for course", courseId, value);
						navigate({ to: "/admin/courses/$courseId", params: { courseId } });
					}}
				/>
			</div>
		</div>
	);
}
