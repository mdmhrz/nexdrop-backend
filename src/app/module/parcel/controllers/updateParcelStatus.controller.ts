import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { updateParcelStatusService } from "../services";
import { IUpdateParcelStatusPayload } from "../interfaces/parcel.interface";
import { updateParcelStatusValidation } from "../validations";

export const updateParcelStatusController = catchAsync(
    async (req: Request, res: Response) => {
        const adminId = req.user?.userId;
        const parcelId = req.params.id;

        if (!adminId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = updateParcelStatusValidation.parse(req.body);
        const payload: IUpdateParcelStatusPayload = {
            status: validatedPayload.status,
            note: validatedPayload.note
        };

        const parcel = await updateParcelStatusService(parcelId, payload, adminId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcel status updated successfully",
            data: parcel
        });
    }
)
