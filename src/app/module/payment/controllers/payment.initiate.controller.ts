import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import status from 'http-status';

import parcelPaymentService from '../../parcel/services/parcelPayment.service';
import { PaymentMethod } from '../../../../generated/prisma/enums';

export const initiatePaymentController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { parcelId, paymentMethod } = req.body;

        const result = await parcelPaymentService.initiateParcelPayment(
            parcelId,
            paymentMethod as PaymentMethod,
            userId
        );

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: 'Payment initiated successfully',
            data: result,
        });
    }
);
