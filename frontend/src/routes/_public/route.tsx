import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "#/components/layout/navbar";

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
});

function PublicLayout() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<Outlet />
		</div>
	);
}
