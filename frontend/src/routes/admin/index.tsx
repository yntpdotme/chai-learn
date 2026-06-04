import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { api } from "#/lib/api";

export const Route = createFileRoute("/admin/")({
	staticData: { breadcrumb: "Dashboard" },
	loader: () => api.admin.stats.get(),
	component: AdminDashboard,
});

function AdminDashboard() {
	const data = Route.useLoaderData();
	const stats = [
		{
			label: "Courses",
			value: String(data.courses),
			to: "/admin/courses" as const,
		},
		{ label: "Lessons", value: String(data.lessons) },
		{ label: "Students", value: String(data.students) },
		{ label: "Completions", value: String(data.completions) },
	];

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