// Path: src/components/layout/theme-toggle.tsx
import { LaptopMinimal, MoonIcon, SunIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "#/lib/utils";
import { Button } from "../ui/button";
import type { ThemeMode } from "./theme-store";
import { getThemeMode, setThemeMode, subscribeThemeMode } from "./theme-store";

export function applyThemeMode(mode: ThemeMode) {
	setThemeMode(mode);
}

type ThemeToggleProps = {
	variant?: "default" | "minimal";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
	const mode = useSyncExternalStore(
		subscribeThemeMode,
		getThemeMode,
		() => "auto",
	);

	function toggleMode() {
		const nextMode: ThemeMode =
			mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setThemeMode(nextMode);
	}

	const label =
		mode === "auto"
			? "Theme mode: auto (system). Click to switch to light mode."
			: `Theme mode: ${mode}. Click to switch mode.`;

	return (
		<Button
			onClick={toggleMode}
			aria-label={label}
			title={label}
			variant="ghost"
			size="icon"
			className={cn(
				variant === "minimal" &&
					"hover:bg-transparent dark:hover:bg-transparent",
			)}
		>
			{mode === "auto" ? (
				<LaptopMinimal
					className={cn("size-5", variant === "minimal" && "text-foreground")}
				/>
			) : mode === "dark" ? (
				<MoonIcon
					className={cn("size-4", variant === "minimal" && "text-foreground")}
				/>
			) : (
				<SunIcon
					className={cn("size-4", variant === "minimal" && "text-foreground")}
				/>
			)}
		</Button>
	);
}
