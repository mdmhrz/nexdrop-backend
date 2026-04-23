import Stripe from 'stripe';
import { IStripePaymentIntent } from '../interfaces';
import { envVars } from '../../../config/env';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
});

export const stripeService = {
    /**
     * Create a Stripe Checkout Session for payment
     */
    async createCheckoutSession(params: {
        amount: number;
        customerEmail: string;
        customerName: string;
        successUrl: string;
        cancelUrl: string;
        metadata: Record<string, string>;
        currency?: string;
    }): Promise<{ url: string; sessionId: string }> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: params.currency || 'usd',
                        product_data: {
                            name: 'Payment',
                            description: params.metadata.description || 'Payment for service',
                        },
                        unit_amount: Math.round(params.amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            customer_email: params.customerEmail,
            metadata: params.metadata,
        });

        return {
            url: session.url as string,
            sessionId: session.id,
        };
    },

    /**
     * Verify Stripe webhook signature
     */
    async verifyWebhookSignature(
        payload: string,
        signature: string
    ): Promise<Stripe.Event> {
        const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;

        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    },

    /**
     * Extract metadata from Stripe event
     */
    extractMetadata(event: Stripe.Event): Record<string, string> | null {
        const session = event.data.object as Stripe.Checkout.Session;
        return session.metadata || null;
    },

    /**
     * Extract amount from Stripe event
     */
    extractAmount(event: Stripe.Event): number {
        const session = event.data.object as Stripe.Checkout.Session;
        return session.amount_total ? session.amount_total / 100 : 0; // Convert from cents
    },

    /**
     * Check if payment was successful
     */
    isPaymentSuccessful(event: Stripe.Event): boolean {
        return event.type === 'checkout.session.completed';
    },
};

export default stripeService;
