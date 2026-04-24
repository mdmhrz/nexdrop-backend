import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    trustedOrigins: [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
        "https://nex-drop-client.vercel.app"
    ],

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },

    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            mapProfileToUser: () => {
                return {
                    role: UserRole.CUSTOMER,
                    status: UserStatus.ACTIVE,
                    emailVerified: true,
                }
            },
        }
    },

    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },

    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: false
            },
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.CUSTOMER
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
        }
    },

    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })


                    if (!user) {
                        console.log(`User with email ${email} not found`)
                        return
                    }

                    if (user && user.role === UserRole.SUPER_ADMIN) {
                        console.log(`User with the email ${email} is a super admin, Skipping email verification`)
                        return
                    }

                    if (user && !user.emailVerified) {
                        sendEmail({
                            to: email,
                            subject: "Verify your email - Nex Drop",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp
                            }
                        }).catch((err) => console.error("Failed to send verification email:", err));
                    }
                } else if (type === "forget-password") {

                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })

                    if (user && !user.emailVerified) {
                        console.log(`User with email ${email} is not verified, Skipping sending password reset OTP`)
                        return
                    }

                    if (user) {
                        sendEmail({
                            to: email,
                            subject: "Password Reset OTP - Nex Drop",
                            templateName: "password-reset-otp",
                            templateData: {
                                name: user.name,
                                otp
                            }
                        }).catch((err) => console.error("Failed to send password reset email:", err));
                    }
                }
            },
            expiresIn: 3 * 60, // 3 minutes
            otpLength: 6

        })
    ],

    session: {
        expiresIn: 60 * 60 * 60 * 24,
        updateAge: 60 * 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24
        }
    },

    redirectURLs: {
        signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },


    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: true,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: '/'
                }
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: '/'
                }
            },
            sessionData: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: '/'
                }
            }
        }
    }
});