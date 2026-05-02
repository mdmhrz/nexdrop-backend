import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { UserRole, UserStatus } from "../src/generated/prisma/enums.js";
import type { Prisma } from "../src/generated/prisma/client.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

// Load environment variables
dotenv.config({ quiet: true });

// Initialize Prisma Client with PostgreSQL adapter
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Initialize better-auth
const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.CUSTOMER,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE,
            },
        },
    },
    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP() {
                // Don't send OTP for seed customer
            },
            expiresIn: 3 * 60,
            otpLength: 6,
        }),
    ],
});

// Colors for console output
const colors: Record<string, string> = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

interface Logger {
    info: (message: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
    step: (step: number | string, message: string) => void;
}

const log: Logger = {
    info: (message: string) => console.log(`${colors.blue}ℹ${colors.reset} ${message}`),
    success: (message: string) => console.log(`${colors.green}✓${colors.reset} ${message}`),
    error: (message: string) => console.log(`${colors.red}✗${colors.reset} ${message}`),
    warn: (message: string) => console.log(`${colors.yellow}⚠${colors.reset} ${message}`),
    step: (step: number | string, message: string) => console.log(`${colors.cyan}[Step ${step}]${colors.reset} ${message}`),
};

const seedCustomer = async () => {
    try {
        log.step(1, "Validating environment variables...");

        const customerEmail = process.env.CUSTOMER_EMAIL;
        const customerPassword = process.env.CUSTOMER_PASSWORD;

        if (!customerEmail) {
            throw new Error("CUSTOMER_EMAIL environment variable is not set");
        }
        if (!customerPassword) {
            throw new Error("CUSTOMER_PASSWORD environment variable is not set");
        }

        log.success(`Email configured: ${customerEmail}`);
        log.info(`Password configured: ${customerPassword.substring(0, 3)}${"*".repeat(customerPassword.length - 3)}`);

        log.step(2, "Connecting to database...");
        // Test connection
        await prisma.$queryRaw`SELECT 1`;
        log.success("Database connection established");

        log.step(3, "Checking if customer already exists...");
        const existingCustomer = await prisma.user.findUnique({
            where: { email: customerEmail },
        });

        if (existingCustomer) {
            log.error(`Customer already exists with email: ${customerEmail}`);
            log.info(`Current role: ${existingCustomer.role}`);
            log.info(`Current status: ${existingCustomer.status}`);
            log.info(`Email verified: ${existingCustomer.emailVerified}`);

            log.step("3.1", "Updating customer privileges...");

            let needsUpdate = false;
            const updateData: Prisma.UserUpdateInput = {};

            if (existingCustomer.role !== UserRole.CUSTOMER) {
                updateData.role = UserRole.CUSTOMER;
                needsUpdate = true;
            }

            if (!existingCustomer.emailVerified) {
                updateData.emailVerified = true;
                needsUpdate = true;
            }

            if (needsUpdate) {
                const updated = await prisma.user.update({
                    where: { id: existingCustomer.id },
                    data: updateData,
                });
                log.success(`Customer updated with role: ${updated.role}`);
                log.success(`Email verified: ${updated.emailVerified}`);
            } else {
                log.success("Customer already has correct configuration");
            }

            log.step("✓", `Customer is ready to use: ${customerEmail}`);
            return;
        }

        log.step(4, "Registering customer via better-auth API...");

        const registrationResult = await auth.api.signUpEmail({
            body: {
                name: "Test Customer",
                email: customerEmail,
                password: customerPassword,
            },
        });

        if (!registrationResult.user) {
            throw new Error("Failed to register customer via better-auth");
        }

        log.success(`User registered via better-auth`);
        log.info(`User ID: ${registrationResult.user.id}`);
        log.info(`Email: ${registrationResult.user.email}`);
        log.info(`Default role: ${registrationResult.user.role}`);

        log.step(5, "Updating customer role to CUSTOMER...");

        const updatedCustomer = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                role: UserRole.CUSTOMER,
                status: UserStatus.ACTIVE,
            },
        });

        log.success(`Role updated to: ${updatedCustomer.role}`);
        log.success(`Status: ${updatedCustomer.status}`);

        log.step(6, "Setting email as verified...");

        const verifiedCustomer = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                emailVerified: true,
            },
        });

        log.success(`Email verified: ${verifiedCustomer.emailVerified}`);

        log.step(7, "Fetching complete customer record...");
        const createdCustomer = await prisma.user.findUnique({
            where: { email: customerEmail },
            include: {
                accounts: true,
            },
        });

        if (!createdCustomer) {
            throw new Error("Failed to verify created customer");
        }

        log.success("Customer record verified in database");

        log.step("✓", "CUSTOMER created successfully!");
        console.log(`
${colors.green}════════════════════════════════════════${colors.reset}
${colors.green}✓ CUSTOMER SEEDED SUCCESSFULLY${colors.reset}
${colors.green}════════════════════════════════════════${colors.reset}

${colors.cyan}Customer Credentials:${colors.reset}
  Email: ${createdCustomer.email}
  Password: ${customerPassword.substring(0, 3)}${"*".repeat(customerPassword.length - 3)}
  Role: ${createdCustomer.role}
  Status: ${createdCustomer.status}
  Email Verified: ${createdCustomer.emailVerified}
  User ID: ${createdCustomer.id}
  Auth Method: email/password (via better-auth)

${colors.yellow}Next Steps:${colors.reset}
  1. Start your development server: pnpm dev
  2. Login with the customer credentials
  3. Create parcels and manage deliveries

${colors.green}════════════════════════════════════════${colors.reset}
    `);

    } catch (error: unknown) {
        log.error("Seeding failed!");
        if (error instanceof Error) {
            console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
            if (error.stack) {
                console.error(`${colors.red}Stack:${colors.reset}`, error.stack);
            }
        } else {
            const errorString = String(error);
            console.error(`${colors.red}Unknown error: ${errorString}${colors.reset}`);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        log.info("Database connection closed");
    }
};

// Run the seed
seedCustomer();
