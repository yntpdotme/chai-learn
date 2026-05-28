import { db } from "#db/index.js";
import { courses } from "#db/schema/courses.js";
export async function seedCourses() {
    await db
        .insert(courses)
        .values([
        {
            title: "Networking for DevOps",
            slug: "networking-for-devops",
            description: "Foundational networking concepts for DevOps engineers, from OSI basics to applied AWS VPC networking.",
        },
    ])
        .onConflictDoNothing();
    console.log("  ↳ courses seeded");
}
