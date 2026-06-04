import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminNav } from "#/components/layout/admin-nav";
import { Breadcrumbs } from "#/components/layout/breadcrumbs";

export const Route = createFileRoute("/admin")({
	beforeLoad: ({ context, location }) => {
		if (!context.user) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}
		if (context.user.role !== "admin") {
			throw redirect({ to: "/" });
		}
	},
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
