import { z } from "zod";
import { RiderStatus } from "../../../../generated/prisma/enums";

export const applyRiderAuthenticatedValidation = z.object({
    district: z.string().min(1, "District is required").max(255, "District must be at most 255 characters")
});

export const applyRiderUnauthenticatedValidation = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    district: z.string().min(1, "District is required").max(255, "District must be at most 255 characters")
});

export const updateRiderStatusValidation = z.object({
    currentStatus: z.nativeEnum(RiderStatus)
});
