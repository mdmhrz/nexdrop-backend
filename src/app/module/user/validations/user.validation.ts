import { z } from "zod";
import { UserRole, UserStatus } from "../../../../generated/prisma/enums";

export const updateUserRoleValidation = z.object({
    role: z.nativeEnum(UserRole)
});

export const updateUserStatusValidation = z.object({
    status: z.nativeEnum(UserStatus)
});

export const updateMyProfileValidation = z.object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().optional()
}).refine(data => data.name || data.phone, {
    message: "At least one field (name or phone) must be provided"
});
