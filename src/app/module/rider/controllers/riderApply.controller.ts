import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { riderApplyService } from "../services";
import { IApplyRiderAuthenticatedPayload, IApplyRiderUnauthenticatedPayload } from "../interfaces/rider.interface";
import { applyRiderAuthenticatedValidation, applyRiderUnauthenticatedValidation } from "../validations";
import { prisma } from "../../../lib/prisma";
import { UserRole } from "../../../../generated/prisma/enums";

export const riderApplyController = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const payload = req.body;
        const userId = user?.userId;

        // Scenario 1: Authenticated user
        if (user) {
            // Check user role
            if (user.role !== UserRole.CUSTOMER) {
                sendResponse(res, {
                    httpStatusCode: status.FORBIDDEN,
                    success: false,
                    message: "Only customers can apply for rider role"
                });
                return;
            }

            // Check if user already has a rider profile
            const dbUser = await prisma.user.findUnique({
                where: { id: userId as string },
                include: { riderProfile: true }
            });

            if (!dbUser) {
                sendResponse(res, {
                    httpStatusCode: status.NOT_FOUND,
                    success: false,
                    message: "User not found"
                });
                return;
            }

            if (dbUser.riderProfile) {
                sendResponse(res, {
                    httpStatusCode: status.CONFLICT,
                    success: false,
                    message: "You already have a rider profile"
                });
                return;
            }

            // Validate only district field (sanitize any other fields)
            const validatedPayload = applyRiderAuthenticatedValidation.parse({
                district: payload.district
            });
            const authenticatedPayload: IApplyRiderAuthenticatedPayload = {
                district: validatedPayload.district
            };

            const result = await riderApplyService(userId as string, authenticatedPayload);

            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "Rider application submitted successfully. Your profile is under review.",
                data: result
            });
        } else {
            // Scenario 2: Unauthenticated user
            // Validate all required fields
            const validatedPayload = applyRiderUnauthenticatedValidation.parse(payload);
            const unauthenticatedPayload: IApplyRiderUnauthenticatedPayload = {
                name: validatedPayload.name,
                email: validatedPayload.email,
                password: validatedPayload.password,
                district: validatedPayload.district
            };

            const result = await riderApplyService(undefined, unauthenticatedPayload);

            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "User profile created and rider application submitted successfully. Please check your email to verify your account.",
                data: result
            });
        }
    }
)
