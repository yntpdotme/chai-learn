import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import type { Course } from "#/lib/api";

export function CourseList({ courses }: { courses: Course[] }) {
	const navigate = useNavigate();

	return (
		<div>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Courses</h1>
					<p className="text-sm text-muted-foreground">
						Manage courses and lessons.
					</p>
				</div>
				<Button render={<Link to="/admin/courses/new" />}>
					<Plus className="mr-1.5 size-4" />
					New course
				</Button>
			</div>

			<div className="relative mt-6 max-w-sm">
				<InputGroup className="mb-0.5 max-w-md">
					<InputGroupInput placeholder="Search courses..." />
					<InputGroupAddon>
						<Search className="size-4 text-muted-foreground" />
					</InputGroupAddon>
				</InputGroup>
			</div>

			{courses.length === 0 ? (
				<p className="mt-6 text-sm text-muted-foreground">
					No courses yet — create your first one.
				</p>
			) : (
				<Table className="mt-4">
					<TableHeader>
						<TableRow>
							<TableHead>Course</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{courses.map((course) => (
							<TableRow
								key={course.id}
								tabIndex={0}
								className="cursor-pointer"
								onClick={() =>
									navigate({
										to: "/admin/courses/$courseId",
										params: { courseId: course.id },
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										navigate({
											to: "/admin/courses/$courseId",
											params: { courseId: course.id },
										});
									}
								}}
							>
								<TableCell>
									<span className="font-medium">{course.title}</span>
									<p className="text-sm text-muted-foreground">{course.slug}</p>
								</TableCell>
								<TableCell className="text-muted-foreground">
									{new Date(course.createdAt).toLocaleDateString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}