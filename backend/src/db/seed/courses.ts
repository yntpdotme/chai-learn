import { db } from "#db/index.ts";
import { courses } from "#db/schema/courses.ts";

export async function seedCourses() {
	await db
		.insert(courses)
		.values([
			{
				title: "Networking for DevOps",
				slug: "networking-for-devops",
				description:
					"Foundational networking concepts for DevOps engineers, from OSI basics to applied AWS VPC networking.",
			},
			{
				title: "Linux for DevOps",
				slug: "linux-for-devops",
				description:
					"Practical Linux skills for DevOps engineers, from the file system and permissions to package and process management, capped with a hands-on capstone.",
			},
		])
		.onConflictDoNothing();

	console.log("  ↳ courses seeded");
}
