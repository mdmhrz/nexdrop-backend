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
        console.log("Deleting admin user for fresh seed...");
        await prisma.account.deleteMany({
            where: {
                user: {
                    email: "superadmin@nexdrop.com",
                },
            },
        });
        await prisma.user.delete({
            where: {
                email: "superadmin@nexdrop.com",
            },
        });
        console.log("✓ Admin user deleted successfully");
    } catch {
        console.log("Admin user not found or already deleted");
    } finally {
        await prisma.$disconnect();
    }
})();
