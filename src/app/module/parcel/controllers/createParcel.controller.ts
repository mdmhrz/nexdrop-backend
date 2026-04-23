import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { createParcelService } from "../services";
import { ICreateParcelPayload } from "../interfaces/parcel.interface";
import { createParcelValidation } from "../validations";

export const createParcelController = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = req.user?.userId;

        if (!customerId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = createParcelValidation.parse(req.body);
        const payload: ICreateParcelPayload = {
            pickupAddress: validatedPayload.pickupAddress,
            deliveryAddress: validatedPayload.deliveryAddress,
            districtFrom: validatedPayload.districtFrom,
            districtTo: validatedPayload.districtTo,
            price: validatedPayload.price,
            note: validatedPayload.note
        };

        const parcel = await createParcelService(customerId as string, payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Parcel created successfully",
            data: parcel
        });
    }
)
