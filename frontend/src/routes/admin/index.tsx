import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/admin/")({
	staticData: { breadcrumb: "Dashboard" },
	component: AdminDashboard,
});

// TODO Phase 6: replace with real counts once an admin stats endpoint exists
const stats = [
	{ label: "Courses", value: "1", to: "/admin/courses" as const },
	{ label: "Lessons", value: "3" },
	{ label: "Students", value: "1" },
	{ label: "Completions", value: "0" },
];

function AdminDashboard() {
	return (
		<div>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<Button render={<Link to="/admin/courses/new" />}>
					<Plus className="mr-1.5 size-4" />
					New course
				</Button>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{stats.map((s) => {
					const card = (
						<Card
							className={s.to && "transition-colors hover:bg-accent/50"}
							key={s.label}
						>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-normal text-muted-foreground">
									{s.label}
								</CardTitle>
							</CardHeader>
							<CardContent className="text-3xl font-semibold">
								{s.value}
							</CardContent>
						</Card>
					);
					return s.to ? (
						<Link key={s.label} to={s.to} className="block">
							{card}
						</Link>
					) : (
						<div key={s.label}>{card}</div>
					);
				})}
			</div>
		</div>
	);
}
