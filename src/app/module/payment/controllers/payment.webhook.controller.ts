import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import status from 'http-status';
import stripeService from '../services/stripe.service';
import paymentService from '../services/payment.service';

export const webhookController = catchAsync(
    async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'] as string;
        const payload = req.body;

        try {
            const event = await stripeService.verifyWebhookSignature(payload, sig);
            await paymentService.handleStripeWebhook(event);

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: 'Webhook processed successfully',
                data: null,
            });
        } catch (error: any) {
            console.error('Webhook error:', error);
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }
    }
);
