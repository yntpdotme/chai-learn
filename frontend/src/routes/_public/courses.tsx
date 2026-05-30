import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/courses")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/courses"!</div>;
}
