import status from "http-status";
import z from "zod";
import { TErrorSources } from "../interfaces/error.interface";

export const handleZodError = (error: z.ZodError) => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";

    const errorSources: TErrorSources[] = []

    errorSources.push(...error.issues.map((issue) => ({
        path: issue.path.join(" "),
        message: issue.message
    })));


    return {
        success: false,
        message,
        statusCode,
        errorSources,
    }
}
