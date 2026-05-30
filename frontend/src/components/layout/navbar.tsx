import { Link } from "@tanstack/react-router";
import { LibraryBigIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import ThemeToggle from "./theme-toggle";

export function Navbar() {
	return (
		<header className="">
			<div className="mx-auto flex h-16 items-center justify-between">
				<Link
					to="/"
					className="flex items-center gap-2 font-medium font-montserrat tracking-tighter"
				>
					<LibraryBigIcon className="size-5 text-primary" />
					Chai aur Learn
				</Link>

				<nav className="flex items-center gap-x-3.5">
					<ThemeToggle variant="minimal" />
					<Button render={<Link to="/login" />}>Login</Button>
				</nav>
			</div>
		</header>
	);
}
