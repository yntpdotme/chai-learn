import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

import { mockCourses } from "#/features/admin/mock-data";
import { CourseForm } from "#/features/courses/course-form";

export const Route = createFileRoute("/admin/courses/$courseId/edit")({
	staticData: { breadcrumb: "Edit" },
	loader: ({ params }) => {
		const course = mockCourses.find((c) => c.id === params.courseId);
		if (!course) throw notFound();
		return course;
	},
	component: EditCoursePage,
});

function EditCoursePage() {
	const course = Route.useLoaderData();
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-2xl font-semibold">Edit course</h1>
			<div className="mt-6">
				<CourseForm
					defaultValues={course}
					submitLabel="Save changes"
					onSubmit={(value) => {
						// TODO Phase 6: PATCH /api/admin/courses/:id
						console.log("update course", course.id, value);
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
