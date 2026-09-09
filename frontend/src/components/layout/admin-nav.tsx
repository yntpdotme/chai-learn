import { Link, useRouteContext } from "@tanstack/react-router";
import { LibraryBigIcon } from "lucide-react";
import { buttonVariants } from "#/components/ui/button";
import ThemeToggle from "./theme-toggle";
import { UserMenu } from "./user-menu";

const links = [
	{ to: "/admin", label: "Dashboard" },
	{ to: "/admin/courses", label: "Courses" },
];

export function AdminNav() {
	const { user } = useRouteContext({ from: "__root__" });

	return (
		<div className="mx-auto flex h-16 items-center justify-between">
			<Link
				to="/"
				className="flex items-center gap-2 font-medium font-montserrat tracking-tighter"
			>
				<LibraryBigIcon className="size-5 text-primary" />
				Chai aur Learn
			</Link>

			<nav className="flex flex-1 items-center justify-end">
				{links.map((l) => (
					<Link
						key={l.to}
						to={l.to}
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						{l.label}
					</Link>
				))}
			</nav>
			<div className="flex items-center gap-2">
				<ThemeToggle variant="minimal" />
				{user && <UserMenu name={user.name} />}
			</div>
		</div>
	);
}
