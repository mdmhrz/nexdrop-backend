import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import sslcommerzService from '../services/sslcommerz.service';
import paymentService from '../services/payment.service';
import { prisma } from '../../../lib/prisma';
import status from 'http-status';
import { sendResponse } from '../../../shared/sendResponse';

export const sslcommerzIPNController = catchAsync(
    async (req: Request, res: Response) => {
        const ipnData = req.body;

        try {
            // Verify IPN signature
            const isValid = sslcommerzService.verifyIPN(ipnData);

            if (!isValid) {
                console.error('SSL Commerz IPN signature verification failed');
                return res.status(status.BAD_REQUEST).json({
                    success: false,
                    message: 'Invalid IPN signature',
                });
            }

            // Extract data from IPN
            const metadata = sslcommerzService.extractMetadata(ipnData);
            const amount = sslcommerzService.extractAmount(ipnData);

            // Check if payment was successful
            if (!sslcommerzService.isPaymentSuccessful(ipnData)) {
                console.log(`SSL Commerz payment failed: ${ipnData.status}`);
                return res.status(status.OK).json({
                    success: true,
                    message: 'IPN received (payment not successful)',
                });
            }

            // Call registered callback for this payment type
            const paymentType = metadata.type || 'default';
            await paymentService.handleWebhookCallback(paymentType, metadata, amount);

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: 'SSL Commerz IPN processed successfully',
                data: null,
            });
        } catch (error: unknown) {
            console.error('SSL Commerz IPN error:', error);
            return res.status(status.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error processing SSL Commerz IPN',
            });
        }
    }
);

export const sslcommerzSuccessController = catchAsync(
    async (req: Request, res: Response) => {
        const { val_id } = req.body;

        if (!val_id || typeof val_id !== 'string') {
            console.log('Missing val_id in request body', { body: req.body });
            return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Invalid validation ID`);
        }

        try {
            // Validate payment with SSL Commerz API
            const validation = await sslcommerzService.validatePayment(val_id);

            if (!validation.isValid) {
                console.log('SSL Commerz payment validation failed');
                return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Invalid payment`);
            }

            // Find payment by transaction ID
            const payment = await paymentService.findPaymentByTransactionId(validation.tranId);

            if (!payment) {
                console.log('Payment not found for transaction ID:', validation.tranId);
                return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Payment not found`);
            }

            // If payment already successful, redirect to success
            if (payment.status === 'SUCCESS') {
                return res.redirect(`${process.env.FRONTEND_URL}/payment/success?session_id=${validation.tranId}`);
            }

            // Update payment status
            await paymentService.updatePaymentStatus(payment.id, 'SUCCESS');

            // Get parcel info to construct metadata
            const parcel = await prisma.parcel.findUnique({
                where: { id: payment.parcelId },
            });

            if (!parcel) {
                console.log('Parcel not found for payment:', payment.id);
                return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=Parcel not found`);
            }

            // Construct metadata for callback
            const metadata = {
                type: 'parcel',
                parcelId: parcel.id,
                description: `Parcel Delivery - ${parcel.trackingId}`,
            };

            // Call registered callback for this payment type
            const paymentType = metadata.type || 'default';
            await paymentService.handleWebhookCallback(paymentType, metadata, validation.amount);

            // Redirect to frontend success page
            return res.redirect(`${process.env.FRONTEND_URL}/payment/success?session_id=${validation.tranId}`);
        } catch (error: unknown) {
            console.error('SSL Commerz success callback error:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/fail?error=${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
);

export default { sslcommerzIPNController, sslcommerzSuccessController };
