import { createFileRoute, Outlet } from "@tanstack/react-router";
import ThemeToggle from "#/components/layout/theme-toggle";

export const Route = createFileRoute("/_auth")({
	component: PublicLayout,
});

function PublicLayout() {
	return (
		<div className="min-h-screen relative">
			<div className="absolute right-5 top-5">
				<ThemeToggle />
			</div>
			<Outlet />
		</div>
	);
}
