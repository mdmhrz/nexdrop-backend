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
                // Don't send OTP for seed admin
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

const seedAdmin = async () => {
    try {
        log.step(1, "Validating environment variables...");

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

        if (!superAdminEmail) {
            throw new Error("SUPER_ADMIN_EMAIL environment variable is not set");
        }
        if (!superAdminPassword) {
            throw new Error("SUPER_ADMIN_PASSWORD environment variable is not set");
        }

        log.success(`Email configured: ${superAdminEmail}`);
        log.info(`Password configured: ${superAdminPassword.substring(0, 3)}${"*".repeat(superAdminPassword.length - 3)}`);

        log.step(2, "Connecting to database...");
        // Test connection
        await prisma.$queryRaw`SELECT 1`;
        log.success("Database connection established");

        log.step(3, "Checking if admin already exists...");
        const existingAdmin = await prisma.user.findUnique({
            where: { email: superAdminEmail },
        });

        if (existingAdmin) {
            log.error(`Admin user already exists with email: ${superAdminEmail}`);
            log.info(`Current role: ${existingAdmin.role}`);
            log.info(`Current status: ${existingAdmin.status}`);
            log.info(`Email verified: ${existingAdmin.emailVerified}`);

            log.step("3.1", "Updating admin privileges...");

            let needsUpdate = false;
            const updateData: Prisma.UserUpdateInput = {};

            if (existingAdmin.role !== UserRole.SUPER_ADMIN) {
                updateData.role = UserRole.SUPER_ADMIN;
                needsUpdate = true;
            }

            if (!existingAdmin.emailVerified) {
                updateData.emailVerified = true;
                needsUpdate = true;
            }

            if (needsUpdate) {
                const updated = await prisma.user.update({
                    where: { id: existingAdmin.id },
                    data: updateData,
                });
                log.success(`Admin updated with role: ${updated.role}`);
                log.success(`Email verified: ${updated.emailVerified}`);
            } else {
                log.success("Admin already has correct configuration");
            }

            log.step("✓", `Admin is ready to use: ${superAdminEmail}`);
            return;
        }

        log.step(4, "Registering admin via better-auth API...");

        const registrationResult = await auth.api.signUpEmail({
            body: {
                name: "Super Admin",
                email: superAdminEmail,
                password: superAdminPassword,
            },
        });

        if (!registrationResult.user) {
            throw new Error("Failed to register admin via better-auth");
        }

        log.success(`User registered via better-auth`);
        log.info(`User ID: ${registrationResult.user.id}`);
        log.info(`Email: ${registrationResult.user.email}`);
        log.info(`Default role: ${registrationResult.user.role}`);

        log.step(5, "Updating admin role to SUPER_ADMIN...");

        const updatedAdmin = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                role: UserRole.SUPER_ADMIN,
                status: UserStatus.ACTIVE,
            },
        });

        log.success(`Role updated to: ${updatedAdmin.role}`);
        log.success(`Status: ${updatedAdmin.status}`);

        log.step(6, "Setting email as verified...");

        const verifiedAdmin = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                emailVerified: true,
            },
        });

        log.success(`Email verified: ${verifiedAdmin.emailVerified}`);

        log.step(7, "Fetching complete admin record...");
        const createdAdmin = await prisma.user.findUnique({
            where: { email: superAdminEmail },
            include: {
                accounts: true,
            },
        });

        if (!createdAdmin) {
            throw new Error("Failed to verify created admin");
        }

        log.success("Admin record verified in database");

        log.step("✓", "SUPER_ADMIN created successfully!");
        console.log(`
${colors.green}════════════════════════════════════════${colors.reset}
${colors.green}✓ SUPER ADMIN SEEDED SUCCESSFULLY${colors.reset}
${colors.green}════════════════════════════════════════${colors.reset}

${colors.cyan}Admin Credentials:${colors.reset}
  Email: ${createdAdmin.email}
  Password: ${superAdminPassword.substring(0, 3)}${"*".repeat(superAdminPassword.length - 3)}
  Role: ${createdAdmin.role}
  Status: ${createdAdmin.status}
  Email Verified: ${createdAdmin.emailVerified}
  User ID: ${createdAdmin.id}
  Auth Method: email/password (via better-auth)

${colors.yellow}Next Steps:${colors.reset}
  1. Start your development server: pnpm dev
  2. Login with the admin credentials
  3. Access admin dashboard and manage the application

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
seedAdmin();
