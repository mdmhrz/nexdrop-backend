import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

dotenv.config({ quiet: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

(async () => {
    try {
        const riderEmail = process.env.RIDER_EMAIL;
        if (!riderEmail) {
            throw new Error("RIDER_EMAIL environment variable is not set");
        }

        console.log(`Deleting rider user (${riderEmail}) for fresh seed...`);
        
        // Delete rider profile first (due to foreign key constraint)
        await prisma.rider.deleteMany({
            where: {
                user: {
                    email: riderEmail,
                },
            },
        });
        
        // Delete accounts associated with the user
        await prisma.account.deleteMany({
            where: {
                user: {
                    email: riderEmail,
                },
            },
        });
        
        // Delete the user
        await prisma.user.delete({
            where: {
                email: riderEmail,
            },
        });
        console.log("✓ Rider user deleted successfully");
    } catch (error) {
        console.log("Rider user not found or already deleted");
    } finally {
        await prisma.$disconnect();
    }
})();
