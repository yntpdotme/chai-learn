import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
			<p className="text-sm font-medium text-primary">
				Welcome to Chai aur DevOps
			</p>
			<h1 className="mt-4 max-w-2xl text-4xl font-medium sm:text-6xl">
				Hands On DevOps.
			</h1>
			<p className="mt-4 max-w-md text-muted-foreground">
				Structured courses, hands-on lessons, and a clear path from zero to
				production.
			</p>
			<Button size="lg" className="mt-8" render={<Link to="/courses" />}>
				Browse Courses
				<ArrowRight className="ml-2 size-4" />
			</Button>
		</main>
	);
}
