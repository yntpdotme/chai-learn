import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/courses/$courseId")({
	loader: ({ params }) => api.courses.get(params.courseId),
	staticData: {
		breadcrumb: ({ loaderData }) =>
			(loaderData as { title?: string } | undefined)?.title ?? "Course",
	},
	component: () => <Outlet />,
});