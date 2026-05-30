import { Fragment } from "react";
import { Link, useMatches } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

const MAX_VISIBLE = 2;

type Crumb = { key: string; title: string; path: string };

function resolveCrumb(
	match: ReturnType<typeof useMatches>[number],
): Crumb | null {
	const { breadcrumb } = match.staticData;
	if (!breadcrumb) return null;

	const title =
		typeof breadcrumb === "function"
			? breadcrumb({ params: match.params, loaderData: match.loaderData })
			: breadcrumb;

	return { key: match.id, title, path: match.pathname };
}

export function Breadcrumbs() {
	const matches = useMatches();

	const crumbs = matches
		.map(resolveCrumb)
		.filter((c): c is Crumb => c !== null);

	const collapse = crumbs.length > MAX_VISIBLE;
	const hidden = collapse ? crumbs.slice(0, -1) : [];
	const visible = collapse ? crumbs.slice(-1) : crumbs;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link to="/admin" />}>Admin</BreadcrumbLink>
				</BreadcrumbItem>

				{crumbs.length > 0 && <BreadcrumbSeparator />}

				{collapse && (
					<>
						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger aria-label="Show hidden breadcrumbs">
									<BreadcrumbEllipsis className="size-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{hidden.map((c) => (
										<DropdownMenuItem key={c.key} render={<Link to={c.path} />}>
											{c.title}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
					</>
				)}

				{visible.map((c, i) => {
					const isLast = i === visible.length - 1;
					return (
						<Fragment key={c.key}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{c.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink render={<Link to={c.path} />}>
										{c.title}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
