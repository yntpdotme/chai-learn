import { createFileRoute } from "@tanstack/react-router";
import { CourseList } from "#/features/admin/course-list";

export const Route = createFileRoute("/admin/courses/")({
	staticData: { breadcrumb: "Courses" },
	component: CourseList,
});
