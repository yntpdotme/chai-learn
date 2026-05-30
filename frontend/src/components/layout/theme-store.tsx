// Path: src/components/layout/theme-store.ts
export type ThemeMode = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";

function isThemeMode(value: string | null): value is ThemeMode {
	return value === "light" || value === "dark" || value === "auto";
}

function readStoredMode(): ThemeMode {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return isThemeMode(stored) ? stored : "auto";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
	if (mode !== "auto") return mode;
	const prefersDark =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

function applyToDocument(mode: ThemeMode) {
	if (typeof document === "undefined") return;
	const resolved = resolveTheme(mode);
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	if (mode === "auto") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", mode);
	}
	root.style.colorScheme = resolved;
}

let currentMode: ThemeMode = readStoredMode();
const listeners = new Set<(mode: ThemeMode) => void>();

export function getThemeMode() {
	return currentMode;
}

export function setThemeMode(mode: ThemeMode) {
	currentMode = mode;
	if (typeof window !== "undefined") {
		window.localStorage.setItem(STORAGE_KEY, mode);
	}
	applyToDocument(mode);
	// biome-ignore lint/suspicious/useIterableCallbackReturn: <>
	listeners.forEach((listener) => listener(mode));
}

export function subscribeThemeMode(listener: (mode: ThemeMode) => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

if (typeof window !== "undefined") {
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (currentMode === "auto") applyToDocument("auto");
		});

	window.addEventListener("storage", (e) => {
		if (e.key === STORAGE_KEY && isThemeMode(e.newValue)) {
			currentMode = e.newValue;
			applyToDocument(currentMode);
			// biome-ignore lint/suspicious/useIterableCallbackReturn: <>
			listeners.forEach((listener) => listener(currentMode));
		}
	});
}
