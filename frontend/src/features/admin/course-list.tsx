import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { Kbd } from "#/components/ui/kbd";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { mockCourses } from "./mock-data";

export function CourseList() {
	const navigate = useNavigate();
	const [isMac, setIsMac] = useState(true);

	useEffect(() => {
		setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
	}, []);

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
					<InputGroupInput placeholder="Search your people..." />

					<InputGroupAddon>
						<Search className="size-4 text-muted-foreground" />
					</InputGroupAddon>

					<InputGroupAddon align="inline-end" className="max-sm:hidden">
						<Kbd>{isMac ? "⌘K" : "⌃K"}</Kbd>
					</InputGroupAddon>
				</InputGroup>
			</div>

			<Table className="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>Course</TableHead>
						<TableHead>Lessons</TableHead>
						<TableHead>Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{mockCourses.map((course) => {
						return (
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
								<TableCell>{course.lessons.length}</TableCell>
								<TableCell className="text-muted-foreground">
									{course.createdAt}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
