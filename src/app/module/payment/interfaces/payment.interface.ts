import { PaymentMethod } from '../../../../generated/prisma/enums';

export interface IPaymentInitiatePayload {
    amount: number;
    customerEmail: string;
    customerName: string;
    paymentMethod: PaymentMethod;
    metadata: Record<string, string>; // Generic metadata for any module
    successUrl: string;
    cancelUrl: string;
}

export interface IPaymentInitiateResponse {
    paymentUrl: string;
    sessionId: string;
    amount: number;
    metadata: Record<string, string>;
}

export interface IStripePaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret: string;
}

export interface IWebhookEvent {
    type: string;
    data: {
        object: {
            id: string;
            amount: number;
            currency: string;
            status: string;
            metadata: Record<string, string>;
        };
    };
}

export type WebhookCallback = (metadata: Record<string, string>, amount: number) => Promise<void>;
