import { z } from 'zod';

export const paymentInitiateSchema = z.object({
    parcelId: z.string().uuid('Invalid parcel ID format'),
    paymentMethod: z.enum(['STRIPE', 'SSLCOMMERZ'], {
        message: 'Payment method must be STRIPE or SSLCOMMERZ',
    }),
});

export type PaymentInitiateInput = z.infer<typeof paymentInitiateSchema>;
