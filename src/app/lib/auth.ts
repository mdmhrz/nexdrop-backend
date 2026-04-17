import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";





export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false
            },
            role: {
                type: "string",
                required: false,
                default: UserRole.CUSTOMER
            },
            status: {
                type: "string",
                required: false,
                default: UserStatus.ACTIVE
            }
        }
    }
});