import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getParcelByIdService } from "../services";

export const getParcelByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const parcelId = req.params.id;

        if (!userId || !userRole) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const parcel = await getParcelByIdService(parcelId as string, userId as string, userRole as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel fetched successfully",
            data: parcel
        });
    }
)
