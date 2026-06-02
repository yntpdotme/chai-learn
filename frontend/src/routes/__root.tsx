import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ApiError, api } from "#/lib/api";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Chai Learn",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	staleTime: 5 * 60 * 1000,
	notFoundComponent: NotFound,
	beforeLoad: async () => {
		try {
			const user = await api.me.get();
			return { user };
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				return { user: null };
			}
			throw err;
		}
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="max-w-5xl mx-auto px-4 sm:px-6">
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "#/components/ui/button";

export function NotFound() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="text-2xl font-semibold">Page not found</h1>
			<p className="mt-2 text-muted-foreground">
				The page you're looking for doesn't exist.
			</p>
			<Link to="/" className={buttonVariants({ className: "mt-6" })}>
				Back to home
			</Link>
		</div>
	);
}
