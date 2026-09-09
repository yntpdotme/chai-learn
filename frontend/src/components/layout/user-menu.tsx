import { useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { authClient } from "#/lib/auth-client";

export function UserMenu({ name }: { name: string }) {
	const router = useRouter();
	const navigate = useNavigate();
	const [signingOut, setSigningOut] = useState(false);

	async function handleSignOut() {
		setSigningOut(true);
		try {
			await authClient.signOut();
			await router.invalidate();
			await navigate({ to: "/" });
		} finally {
			setSigningOut(false);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="outline" size="sm">
						{name}
						<ChevronDownIcon />
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="min-w-44">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{name}</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					disabled={signingOut}
					onClick={handleSignOut}
				>
					<LogOutIcon />
					{signingOut ? "Signing out…" : "Log out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
