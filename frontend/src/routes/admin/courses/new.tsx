import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CourseForm } from "#/features/courses/course-form";

export const Route = createFileRoute("/admin/courses/new")({
	staticData: { breadcrumb: "New" },
	component: NewCoursePage,
});

function NewCoursePage() {
	const navigate = useNavigate();
	return (
		<div>
			<h1 className="text-2xl font-semibold">New course</h1>
			<div className="mt-6">
				<CourseForm
					submitLabel="Create course"
					onSubmit={(value) => {
						// TODO Phase 6: POST /api/admin/courses
						console.log("create course", value);
						navigate({ to: "/admin/courses" });
					}}
				/>
			</div>
		</div>
	);
}
