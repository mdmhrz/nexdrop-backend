import status from 'http-status';
import AppError from '../../../errorHelper/AppError';
import { prisma } from '../../../lib/prisma';
import { IPaymentInitiatePayload, IPaymentInitiateResponse, WebhookCallback } from '../interfaces';
import stripeService from './stripe.service';

// Webhook callback registry
const webhookCallbacks: Map<string, WebhookCallback> = new Map();

export const paymentService = {
    /**
     * Register a webhook callback for a specific module/type
     */
    registerWebhookCallback(type: string, callback: WebhookCallback): void {
        webhookCallbacks.set(type, callback);
    },

    /**
     * Initiate payment (generic)
     */
    async initiatePayment(
        payload: IPaymentInitiatePayload
    ): Promise<IPaymentInitiateResponse> {
        const { amount, customerEmail, customerName, paymentMethod, metadata, successUrl, cancelUrl, currency } = payload;

        // Check amount
        if (amount <= 0) {
            throw new AppError(status.BAD_REQUEST, 'Invalid payment amount');
        }

        // Create payment based on method
        let paymentUrl: string;
        let sessionId: string;

        if (paymentMethod === 'STRIPE') {
            const stripeResult = await stripeService.createCheckoutSession({
                amount,
                customerEmail,
                customerName,
                successUrl,
                cancelUrl,
                metadata,
                currency,
            });

            paymentUrl = stripeResult.url;
            sessionId = stripeResult.sessionId;
        } else if (paymentMethod === 'MANUAL') {
            throw new AppError(status.BAD_REQUEST, 'Manual payment not implemented yet');
        } else if (paymentMethod === 'BKASH') {
            throw new AppError(status.BAD_REQUEST, 'bKash payment not implemented yet');
        } else {
            throw new AppError(status.BAD_REQUEST, 'Invalid payment method');
        }

        return {
            paymentUrl,
            sessionId,
            amount,
            metadata,
        };
    },

    /**
     * Handle Stripe webhook (generic)
     */
    async handleStripeWebhook(event: any): Promise<void> {
        const metadata = stripeService.extractMetadata(event);

        if (!metadata) {
            throw new Error('Metadata not found in webhook');
        }

        if (!stripeService.isPaymentSuccessful(event)) {
            return; // Payment not successful, do nothing
        }

        const amount = stripeService.extractAmount(event);
        const paymentType = metadata.type || 'default';

        // Call registered callback for this payment type
        const callback = webhookCallbacks.get(paymentType);
        if (callback) {
            await callback(metadata, amount);
        } else {
            console.warn(`No callback registered for payment type: ${paymentType}`);
        }
    },
};

export default paymentService;
