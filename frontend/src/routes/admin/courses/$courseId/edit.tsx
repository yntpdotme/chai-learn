import {
	createFileRoute,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { CourseForm } from "#/features/courses/course-form";

export const Route = createFileRoute("/admin/courses/$courseId/edit")({
	staticData: { breadcrumb: "Edit" },
	component: EditCoursePage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function EditCoursePage() {
	const course = routeApi.useLoaderData();
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-2xl font-semibold">Edit course</h1>
			<div className="mt-6">
				<CourseForm
					defaultValues={course}
					submitLabel="Save changes"
					onSubmit={(value) => {
						// TODO: PATCH /api/admin/courses/:id — endpoint doesn't exist yet
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
