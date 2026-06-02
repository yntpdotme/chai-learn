import { createFileRoute } from "@tanstack/react-router";

import { CourseList } from "#/features/admin/course-list";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/")({
	staticData: { breadcrumb: "Courses" },
	loader: () => api.courses.list(),
	component: CoursesIndexPage,
});

function CoursesIndexPage() {
	const courses = Route.useLoaderData();
	return <CourseList courses={courses} />;
}
