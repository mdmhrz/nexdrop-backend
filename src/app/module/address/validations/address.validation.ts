import { z } from "zod";

export const createAddressValidation = z.object({
    label: z.string().min(1).max(255),
    address: z.string().min(1).max(500),
    district: z.string().min(1).max(255),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
});

export const updateAddressValidation = z.object({
    label: z.string().min(1).max(255).optional(),
    address: z.string().min(1).max(500).optional(),
    district: z.string().min(1).max(255).optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
}).refine(data => data.label || data.address || data.district || data.phone || data.isDefault !== undefined, {
    message: "At least one field must be provided"
});
