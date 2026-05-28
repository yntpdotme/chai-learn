import "dotenv/config";
import { seedCourses } from "#db/seed/courses.js";
import { seedLessons } from "#db/seed/lessons.js";
import { seedUsers } from "#db/seed/users.js";

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
