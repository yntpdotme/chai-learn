import {
	createFileRoute,
	getRouteApi,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { CourseForm } from "#/features/courses/course-form";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/$courseId/edit")({
	staticData: { breadcrumb: "Edit" },
	component: EditCoursePage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function EditCoursePage() {
	const course = routeApi.useLoaderData();
	const navigate = useNavigate();
	const router = useRouter();

	return (
		<div>
			<h1 className="text-2xl font-semibold">Edit course</h1>
			<div className="mt-6">
				<CourseForm
					defaultValues={course}
					submitLabel="Save changes"
					onSubmit={async (value) => {
						await api.admin.courses.update(course.id, value);
						await router.invalidate();
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
