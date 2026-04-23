/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelper/handleZodError";
import AppError from "../errorHelper/AppError";
import { Prisma } from "../../generated/prisma/client";
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError } from "../errorHelper/handlePrismaErrors";


export const globalErrorHandler = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.error("Global Error Handler:", error);
    }

    let errorSources: TErrorSources[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaClientKnownRequestError(error)
        statusCode = simplifiedError.statusCode || status.CONFLICT
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
    }
    else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        const simplifiedError = handlePrismaClientUnknownError(error);
        statusCode = simplifiedError.statusCode || status.INTERNAL_SERVER_ERROR
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
    }
    else if (error instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaClientValidationError(error)
        statusCode = simplifiedError.statusCode || status.BAD_REQUEST
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
    }
    else if (error instanceof Prisma.PrismaClientRustPanicError) {
        const simplifiedError = handlerPrismaClientRustPanicError();
        statusCode = simplifiedError.statusCode || status.INTERNAL_SERVER_ERROR
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
    }
    else if (error instanceof Prisma.PrismaClientInitializationError) {
        const simplifiedError = handlerPrismaClientInitializationError(error);
        statusCode = simplifiedError.statusCode || status.SERVICE_UNAVAILABLE
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
    }
    else if (error instanceof z.ZodError) {
        const simplifiedErrors = handleZodError(error);
        statusCode = simplifiedErrors.statusCode;
        message = simplifiedErrors.message;
        errorSources.push(...simplifiedErrors.errorSources);
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = error.message;
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message,
        errorSources,
        stack: envVars.NODE_ENV === "development" ? error.stack : undefined,
        error: envVars.NODE_ENV === "development" ? (error instanceof Error ? error.message : "Unknown error") : "Internal Server Error"
    }


    res.status(statusCode).json(errorResponse);

}
