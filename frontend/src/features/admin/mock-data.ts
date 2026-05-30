export type AdminLesson = { id: string; title: string; order: number };

export type AdminCourse = {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	createdAt: string;
	lessons: AdminLesson[];
};

export const mockCourses: AdminCourse[] = [
	{
		id: "1",
		title: "Linux Fundamentals",
		slug: "linux-fundamentals",
		description: "Learn the basics of Linux for DevOps.",
		createdAt: "2026-08-01",
		lessons: [
			{ id: "1", title: "Intro to the Shell", order: 1 },
			{ id: "2", title: "File Permissions", order: 2 },
			{ id: "3", title: "Processes & systemd", order: 3 },
		],
	},
];