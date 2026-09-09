import { Link, useRouteContext } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Button, buttonVariants } from "#/components/ui/button";
import ThemeToggle from "./theme-toggle";

export function Navbar() {
	const { user } = useRouteContext({ from: "__root__" });

	return (
		<header className="border-b border-dashed">
			<div className="mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-2 font-semibold">
					<GraduationCap className="size-5 text-primary" />
					ChaiLearn
				</Link>

				<nav className="flex items-center gap-2">
					<ThemeToggle variant="minimal" />
					{user ? (
						user.role === "admin" ? (
							<Link
								to="/admin"
								className={buttonVariants({ variant: "outline", size: "sm" })}
							>
								Admin
							</Link>
						) : (
							<Button variant="outline" size="sm" disabled>
								{user.name}
							</Button>
						)
					) : (
						<Link
							to="/login"
							className={buttonVariants({ variant: "default" })}
						>
							Login
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
}
