import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { IAcceptParcelPayload } from "../interfaces/parcel.interface";
import { acceptParcelValidation } from "../validations";
import { acceptParcelService } from "../services";

export const acceptParcelController = catchAsync(
    async (req: Request, res: Response) => {
        const riderId = req.user?.userId;
        const parcelId = req.params.id;

        if (!riderId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = acceptParcelValidation.parse(req.body);
        const payload: IAcceptParcelPayload = {
            note: validatedPayload.note
        };

        const parcel = await acceptParcelService(riderId as string, parcelId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel accepted successfully",
            data: parcel
        });
    }
)
