// Path: packages/db/src/seed/dev/lessons.ts
import { eq } from "drizzle-orm";
import { db } from "#db/index.ts";
import { courses } from "#db/schema/courses.ts";
import { lessons } from "#db/schema/lessons.ts";

const LESSONS_BY_COURSE_SLUG: Record<
	string,
	{ title: string; content: string; order: number }[]
> = {
	"networking-for-devops": [
		{
			title: "Setting Context",
			content: "Intro and goals for the bootcamp.",
			order: 1,
		},
		{
			title: "Syllabus",
			content: "Overview of what will be covered.",
			order: 2,
		},
		{
			title: "Foundation",
			content: "Core networking concepts and terminology.",
			order: 3,
		},
		{
			title: "Network Models (OSI & TCP/IP)",
			content: "Understanding the OSI and TCP/IP reference models.",
			order: 4,
		},
		{
			title: "Network Devices",
			content: "Routers, switches, hubs, and other core devices.",
			order: 5,
		},
		{
			title: "Network Layer & IP Addressing",
			content: "IP addressing, subnetting, and routing basics.",
			order: 6,
		},
		{
			title: "Transport Layer (TCP & UDP)",
			content: "how TCP and UDP work and when to use each.",
			order: 7,
		},
		{
			title: "Application Layer (DNS, TLS/SSL & HTTP)",
			content: "DNS resolution, TLS/SSL handshakes, and HTTP fundamentals.",
			order: 8,
		},
		{
			title: "Proxies & Load Balancers",
			content: "forward/reverse proxies and load balancing strategies.",
			order: 9,
		},
		{
			title: "Applied Networking (AWS VPC)",
			content: "hands-on networking concepts applied to AWS VPC.",
			order: 10,
		},
		{
			title: "What's Next",
			content: "wrap-up and where to go from here.",
			order: 11,
		},
		{
			title: "Bonus",
			content: "bonus content.",
			order: 12,
		},
	],
	"linux-for-devops": [
		{
			title: "Introduction to Linux",
			content: "What Linux is, distributions, and why it matters for DevOps.",
			order: 1,
		},
		{
			title: "File System and Navigation",
			content:
				"The Linux directory hierarchy and moving around with core commands.",
			order: 2,
		},
		{
			title: "User and Permissions",
			content: "Users, groups, ownership, and the permission model.",
			order: 3,
		},
		{
			title: "Package Management",
			content: "Installing and managing software with apt, dnf, and friends.",
			order: 4,
		},
		{
			title: "Process and Job Control",
			content: "Inspecting processes, signals, and foreground/background jobs.",
			order: 5,
		},
		{
			title: "Capstone Project",
			content: "Apply everything in a hands-on end-to-end exercise.",
			order: 6,
		},
		{
			title: "Bonus: CICD",
			content: "A first look at wiring Linux skills into a CI/CD pipeline.",
			order: 7,
		},
		{
			title: "What's Next",
			content: "Where to go from here to deepen your Linux skills.",
			order: 8,
		},
		{
			title: "Outro",
			content: "Wrap-up and closing thoughts.",
			order: 9,
		},
	],
};

export async function seedLessons() {
	for (const [slug, courseLessons] of Object.entries(LESSONS_BY_COURSE_SLUG)) {
		const [course] = await db
			.select()
			.from(courses)
			.where(eq(courses.slug, slug));

		if (!course) {
			console.warn(
				`  ↳ skipped lessons for "${slug}" — course not found, run seedCourses() first`,
			);
			continue;
		}

		const existing = await db
			.select({ id: lessons.id })
			.from(lessons)
			.where(eq(lessons.courseId, course.id));

		if (existing.length > 0) {
			console.log(`  ↳ lessons for "${slug}" already seeded, skipping`);
			continue;
		}

		await db.insert(lessons).values(
			courseLessons.map((lesson) => ({
				courseId: course.id,
				title: lesson.title,
				content: lesson.content,
				order: lesson.order,
			})),
		);
	}

	console.log("  ↳ lessons seeded");
}
