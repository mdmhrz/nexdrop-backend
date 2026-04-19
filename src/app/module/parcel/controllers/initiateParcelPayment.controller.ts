import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import parcelPaymentService from "../services/parcelPayment.service";
import { parcelPaymentValidation } from "../validations";

export const initiateParcelPaymentController = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = req.user?.userId;
        const parcelId = req.params.id as string;

        if (!customerId) {
            sendResponse(res, {
                httpStatusCode: status.UNAUTHORIZED,
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const validatedPayload = parcelPaymentValidation.parse(req.body);

        const result = await parcelPaymentService.initiateParcelPayment(
            parcelId,
            validatedPayload.paymentMethod,
            customerId as string
        );

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment initiated successfully",
            data: result
        });
    }
)
