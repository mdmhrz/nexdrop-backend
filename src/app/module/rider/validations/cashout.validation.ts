import { z } from "zod";

export const requestCashoutValidation = z.object({
    amount: z.number().min(1, "Amount must be at least 1").max(100000, "Amount cannot exceed 100000"),
});

export const getCashoutsValidation = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "PAID", "ALL"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),
});

export const updateCashoutStatusValidation = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
});
