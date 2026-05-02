import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { updateRiderAccountStatusService } from "../services/updateRiderAccountStatus.service";
import { RiderAccountStatus } from "../../../../generated/prisma/enums";

export const updateRiderAccountStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const { riderId } = req.params;
        const { accountStatus } = req.body;

        if (!accountStatus || !Object.values(RiderAccountStatus).includes(accountStatus)) {
            throw new AppError(
                status.BAD_REQUEST,
                `accountStatus must be one of: ${Object.values(RiderAccountStatus).join(", ")}`
            );
        }

        const result = await updateRiderAccountStatusService(riderId as string, accountStatus as RiderAccountStatus);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: `Rider application ${accountStatus.toLowerCase()} successfully`,
            data: result,
        });
    }
);
