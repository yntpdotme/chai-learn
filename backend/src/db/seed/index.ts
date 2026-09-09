import "#lib/load-env.ts";
import { seedCourses } from "#db/seed/courses.ts";
import { seedLessons } from "#db/seed/lessons.ts";
import { seedUsers } from "#db/seed/users.ts";

async function main() {
	console.log("🌱 Seeding database...");
	await seedUsers();
	await seedCourses();
	await seedLessons();
	console.log("✅ Database seeded");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
