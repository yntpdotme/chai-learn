import { Link } from "@tanstack/react-router";
import { LibraryBigIcon } from "lucide-react";
import { buttonVariants } from "#/components/ui/button";
import ThemeToggle from "./theme-toggle";

const links = [
	{ to: "/admin", label: "Dashboard" },
	{ to: "/admin/courses", label: "Courses" },
];

export function AdminNav() {
	return (
		<div className="mx-auto flex h-16 items-center justify-between">
			<Link
				to="/"
				className="flex items-center gap-2 font-medium font-montserrat tracking-tighter"
			>
				<LibraryBigIcon className="size-5 text-primary" />
				Chai aur Learn
			</Link>

			<nav className="flex flex-1 items-center justify-end gap-1">
				{links.map((l) => (
					<Link
						key={l.to}
						to={l.to}
						activeProps={{ className: "bg-accent" }}
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						{l.label}
					</Link>
				))}
			</nav>
			<ThemeToggle variant="minimal" />
		</div>
	);
}
