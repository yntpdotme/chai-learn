import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/courses")({
	component: () => <Outlet />,
});
