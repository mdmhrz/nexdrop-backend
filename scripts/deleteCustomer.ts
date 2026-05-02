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
        const customerEmail = process.env.CUSTOMER_EMAIL;
        if (!customerEmail) {
            throw new Error("CUSTOMER_EMAIL environment variable is not set");
        }

        console.log(`Deleting customer user (${customerEmail}) for fresh seed...`);
        
        // Delete accounts associated with the user
        await prisma.account.deleteMany({
            where: {
                user: {
                    email: customerEmail,
                },
            },
        });
        
        // Delete the user
        await prisma.user.delete({
            where: {
                email: customerEmail,
            },
        });
        console.log("✓ Customer user deleted successfully");
    } catch (error) {
        console.log("Customer user not found or already deleted");
    } finally {
        await prisma.$disconnect();
    }
})();
