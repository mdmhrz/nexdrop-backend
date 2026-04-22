import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { assignRiderService } from "../services";
import { IAssignRiderPayload } from "../interfaces/parcel.interface";
import { assignRiderValidation } from "../validations";

export const assignRiderController = catchAsync(
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

        const validatedPayload = assignRiderValidation.parse(req.body);
        const payload: IAssignRiderPayload = {
            riderId: validatedPayload.riderId,
            note: validatedPayload.note
        };

        const parcel = await assignRiderService(parcelId as string, payload, adminId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Rider assigned successfully",
            data: parcel
        });
    }
)
