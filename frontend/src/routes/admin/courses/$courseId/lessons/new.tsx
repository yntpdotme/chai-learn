import {
	createFileRoute,
	getRouteApi,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";

import { LessonForm } from "#/features/lessons/lesson-form";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/$courseId/lessons/new")({
	staticData: { breadcrumb: "New lesson" },
	component: NewLessonPage,
});

const routeApi = getRouteApi("/admin/courses/$courseId");

function NewLessonPage() {
	const course = routeApi.useLoaderData();
	const navigate = useNavigate();
	const router = useRouter();

	return (
		<div>
			<h1 className="text-2xl font-semibold">New lesson</h1>
			<p className="mt-1 text-sm text-muted-foreground">for {course.title}</p>
			<div className="mt-6">
				<LessonForm
					submitLabel="Create lesson"
					onSubmit={async (value) => {
						await api.admin.lessons.create(course.id, value);
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
