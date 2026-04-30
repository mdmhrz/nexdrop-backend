import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { trackParcelService } from "../services";

export const trackParcelController = catchAsync(
    async (req: Request, res: Response) => {
        const trackingId = req.params.trackingId;

        const parcel = await trackParcelService(trackingId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel fetched successfully",
            data: parcel
        });
    }
);
