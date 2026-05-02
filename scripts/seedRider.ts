import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { UserRole, UserStatus, RiderAccountStatus } from "../src/generated/prisma/enums.js";
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
                // Don't send OTP for seed rider
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

const seedRider = async () => {
    try {
        log.step(1, "Validating environment variables...");

        const riderEmail = process.env.RIDER_EMAIL;
        const riderPassword = process.env.RIDER_PASSWORD;
        const riderDistrict = process.env.RIDER_DISTRICT || "Dhaka";

        if (!riderEmail) {
            throw new Error("RIDER_EMAIL environment variable is not set");
        }
        if (!riderPassword) {
            throw new Error("RIDER_PASSWORD environment variable is not set");
        }

        log.success(`Email configured: ${riderEmail}`);
        log.info(`Password configured: ${riderPassword.substring(0, 3)}${"*".repeat(riderPassword.length - 3)}`);
        log.info(`District configured: ${riderDistrict}`);

        log.step(2, "Connecting to database...");
        // Test connection
        await prisma.$queryRaw`SELECT 1`;
        log.success("Database connection established");

        log.step(3, "Checking if rider already exists...");
        const existingUser = await prisma.user.findUnique({
            where: { email: riderEmail },
            include: { riderProfile: true },
        });

        if (existingUser) {
            log.error(`User already exists with email: ${riderEmail}`);
            log.info(`Current role: ${existingUser.role}`);
            log.info(`Current status: ${existingUser.status}`);
            log.info(`Email verified: ${existingUser.emailVerified}`);

            log.step("3.1", "Updating rider privileges...");

            let needsUpdate = false;
            const updateData: Prisma.UserUpdateInput = {};

            if (existingUser.role !== UserRole.RIDER) {
                updateData.role = UserRole.RIDER;
                needsUpdate = true;
            }

            if (!existingUser.emailVerified) {
                updateData.emailVerified = true;
                needsUpdate = true;
            }

            if (needsUpdate) {
                const updated = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: updateData,
                });
                log.success(`User updated with role: ${updated.role}`);
                log.success(`Email verified: ${updated.emailVerified}`);
            } else {
                log.success("User already has correct configuration");
            }

            // Check if rider profile exists
            if (!existingUser.riderProfile) {
                log.step("3.2", "Creating rider profile...");
                const riderProfile = await prisma.rider.create({
                    data: {
                        userId: existingUser.id,
                        district: riderDistrict,
                        accountStatus: RiderAccountStatus.ACTIVE,
                        currentStatus: "AVAILABLE",
                    },
                });
                log.success(`Rider profile created with district: ${riderProfile.district}`);
                log.success(`Account status: ${riderProfile.accountStatus}`);
            } else {
                log.step("3.2", "Updating rider profile...");
                const updatedRider = await prisma.rider.update({
                    where: { id: existingUser.riderProfile.id },
                    data: {
                        district: riderDistrict,
                        accountStatus: RiderAccountStatus.ACTIVE,
                    },
                });
                log.success(`Rider profile updated with district: ${updatedRider.district}`);
                log.success(`Account status: ${updatedRider.accountStatus}`);
            }

            log.step("✓", `Rider is ready to use: ${riderEmail}`);
            return;
        }

        log.step(4, "Registering rider via better-auth API...");

        const registrationResult = await auth.api.signUpEmail({
            body: {
                name: "Test Rider",
                email: riderEmail,
                password: riderPassword,
            },
        });

        if (!registrationResult.user) {
            throw new Error("Failed to register rider via better-auth");
        }

        log.success(`User registered via better-auth`);
        log.info(`User ID: ${registrationResult.user.id}`);
        log.info(`Email: ${registrationResult.user.email}`);
        log.info(`Default role: ${registrationResult.user.role}`);

        log.step(5, "Updating rider role to RIDER...");

        const updatedUser = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                role: UserRole.RIDER,
                status: UserStatus.ACTIVE,
            },
        });

        log.success(`Role updated to: ${updatedUser.role}`);
        log.success(`Status: ${updatedUser.status}`);

        log.step(6, "Setting email as verified...");

        const verifiedUser = await prisma.user.update({
            where: { id: registrationResult.user.id },
            data: {
                emailVerified: true,
            },
        });

        log.success(`Email verified: ${verifiedUser.emailVerified}`);

        log.step(7, "Creating rider profile...");

        const riderProfile = await prisma.rider.create({
            data: {
                userId: registrationResult.user.id,
                district: riderDistrict,
                accountStatus: RiderAccountStatus.ACTIVE,
                currentStatus: "AVAILABLE",
            },
        });

        log.success(`Rider profile created`);
        log.info(`District: ${riderProfile.district}`);
        log.info(`Account status: ${riderProfile.accountStatus}`);
        log.info(`Current status: ${riderProfile.currentStatus}`);

        log.step(8, "Fetching complete rider record...");
        const createdRider = await prisma.user.findUnique({
            where: { email: riderEmail },
            include: {
                riderProfile: true,
                accounts: true,
            },
        });

        if (!createdRider) {
            throw new Error("Failed to verify created rider");
        }

        log.success("Rider record verified in database");

        log.step("✓", "RIDER created successfully!");
        console.log(`
${colors.green}════════════════════════════════════════${colors.reset}
${colors.green}✓ RIDER SEEDED SUCCESSFULLY${colors.reset}
${colors.green}════════════════════════════════════════${colors.reset}

${colors.cyan}Rider Credentials:${colors.reset}
  Email: ${createdRider.email}
  Password: ${riderPassword.substring(0, 3)}${"*".repeat(riderPassword.length - 3)}
  Role: ${createdRider.role}
  Status: ${createdRider.status}
  Email Verified: ${createdRider.emailVerified}
  User ID: ${createdRider.id}
  District: ${createdRider.riderProfile?.district}
  Account Status: ${createdRider.riderProfile?.accountStatus}
  Current Status: ${createdRider.riderProfile?.currentStatus}
  Auth Method: email/password (via better-auth)

${colors.yellow}Next Steps:${colors.reset}
  1. Start your development server: pnpm dev
  2. Login with the rider credentials
  3. Access rider dashboard and start accepting parcels

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
seedRider();
