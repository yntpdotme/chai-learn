import { createFileRoute, Outlet } from "@tanstack/react-router";

import { mockCourses } from "#/features/admin/mock-data";

export const Route = createFileRoute("/admin/courses/$courseId")({
	staticData: {
		breadcrumb: ({ params }) =>
			mockCourses.find((c) => c.id === params.courseId)?.title ?? "Course",
	},
	component: () => <Outlet />,
});
