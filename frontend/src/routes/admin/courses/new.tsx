import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";

import { CourseForm } from "#/features/courses/course-form";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/new")({
	staticData: { breadcrumb: "New" },
	component: NewCoursePage,
});

function NewCoursePage() {
	const navigate = useNavigate();
	const router = useRouter();

	return (
		<div>
			<h1 className="text-2xl font-semibold">New course</h1>
			<div className="mt-6">
				<CourseForm
					submitLabel="Create course"
					onSubmit={async (value) => {
						const created = await api.admin.courses.create(value);
						await router.invalidate();
						navigate({
							to: "/admin/courses/$courseId",
							params: { courseId: created.id },
						});
					}}
				/>
			</div>
		</div>
	);
}
