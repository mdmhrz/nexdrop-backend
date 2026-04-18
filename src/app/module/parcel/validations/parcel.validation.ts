import { z } from "zod";

export const pickParcelValidation = z.object({
    note: z.string().optional()
});

export const deliverParcelValidation = z.object({
    note: z.string().optional()
});

export const acceptParcelValidation = z.object({
    note: z.string().optional()
});
