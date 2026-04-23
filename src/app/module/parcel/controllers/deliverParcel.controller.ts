import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { deliverParcelService } from "../services";
import { IDeliverParcelPayload } from "../interfaces/parcel.interface";
import { deliverParcelValidation } from "../validations";

export const deliverParcelController = catchAsync(
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

        const validatedPayload = deliverParcelValidation.parse(req.body);
        const payload: IDeliverParcelPayload = {
            note: validatedPayload.note
        };

        const parcel = await deliverParcelService(riderId as string, parcelId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel delivered successfully",
            data: parcel
        });
    }
)
