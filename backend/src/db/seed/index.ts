import "dotenv/config";
import { seedCourses } from "./courses.js";
import { seedLessons } from "./lessons.js";
import { seedUsers } from "./users.js";

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
