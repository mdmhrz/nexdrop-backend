import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (req.body && req.body.data) {
            req.body = JSON.parse(req.body.data);
        }

        // Handle empty body case
        const bodyToValidate = req.body || {};

        const parsedResult = zodSchema.safeParse(bodyToValidate);
        if (!parsedResult.success) {
            console.log("Zod validation error", parsedResult.error);
            next(parsedResult.error);
            return;
        }

        // sanitizing the payload
        req.body = parsedResult.data;

        next();
    }
}
