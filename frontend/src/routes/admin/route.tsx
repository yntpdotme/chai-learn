import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminNav } from "#/components/layout/admin-nav";
import { Breadcrumbs } from "#/components/layout/breadcrumbs";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="min-h-screen">
			<AdminNav />
			<div className="py-3">
				<Breadcrumbs />
			</div>
			<main className="pb-6">
				<Outlet />
			</main>
		</div>
	);
}
