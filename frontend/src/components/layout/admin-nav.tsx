import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import ThemeToggle from "./theme-toggle";
import { LibraryBigIcon } from "lucide-react";

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
					<Button
						key={l.to}
						variant="ghost"
						size="sm"
						render={<Link to={l.to} />}
					>
						{l.label}
					</Button>
				))}
			</nav>
			<ThemeToggle variant="minimal" />
		</div>
	);
}
