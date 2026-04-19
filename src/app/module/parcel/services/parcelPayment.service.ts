import status from 'http-status';
import AppError from '../../../errorHelper/AppError';
import { prisma } from '../../../lib/prisma';
import { ParcelStatus, PaymentStatus } from '../../../../generated/prisma/enums';
import { PaymentMethod } from '../../../../generated/prisma/enums';
import paymentService from '../../payment/services/payment.service';
import { envVars } from '../../../config/env';

const EARNING_PERCENTAGE = 0.7; // 70% of parcel price goes to rider

export const parcelPaymentService = {
    /**
     * Initiate payment for a parcel
     */
    async initiateParcelPayment(parcelId: string, paymentMethod: PaymentMethod, userId: string) {
        // Fetch parcel with customer info
        const parcel = await prisma.parcel.findUnique({
            where: { id: parcelId },
            include: {
                customer: true,
            },
        });

        if (!parcel) {
            throw new AppError(status.NOT_FOUND, 'Parcel not found');
        }

        // Check ownership
        if (parcel.customerId !== userId) {
            throw new AppError(status.FORBIDDEN, 'You can only pay for your own parcels');
        }

        // Check if already paid
        if (parcel.isPaid) {
            throw new AppError(status.BAD_REQUEST, 'Parcel is already paid');
        }

        // Check parcel status
        if (parcel.status !== ParcelStatus.REQUESTED) {
            throw new AppError(
                status.BAD_REQUEST,
                'Payment can only be initiated for parcels in REQUESTED status'
            );
        }

        // Check price
        if (parcel.price <= 0) {
            throw new AppError(status.BAD_REQUEST, 'Invalid parcel price');
        }

        // Call generic payment service
        const result = await paymentService.initiatePayment({
            amount: parcel.price,
            customerEmail: parcel.customer.email,
            customerName: parcel.customer.name,
            paymentMethod,
            metadata: {
                type: 'parcel',
                parcelId: parcel.id,
                description: `Parcel Delivery - ${parcel.trackingId}`,
            },
            successUrl: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${envVars.FRONTEND_URL}/payment/cancel?parcel_id=${parcel.id}`,
            currency: 'bdt',
        });

        // Check if payment already exists for this parcel
        const existingPayment = await prisma.payment.findUnique({
            where: { parcelId: parcel.id },
        });

        let payment;

        if (existingPayment) {
            // Update existing payment if it's PENDING or FAILED
            if (existingPayment.status === 'PENDING' || existingPayment.status === 'FAILED') {
                payment = await prisma.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                        amount: parcel.price,
                        paymentMethod,
                        transactionId: result.sessionId,
                        status: 'PENDING',
                    },
                });
            } else {
                // Payment already successful
                throw new AppError(status.BAD_REQUEST, 'Payment already completed for this parcel');
            }
        } else {
            // Create new payment record
            payment = await prisma.payment.create({
                data: {
                    parcelId: parcel.id,
                    customerId: userId,
                    amount: parcel.price,
                    paymentMethod,
                    transactionId: result.sessionId,
                    status: 'PENDING',
                },
            });
        }

        return {
            ...result,
            paymentId: payment.id,
        };
    },

    /**
     * Handle parcel payment webhook callback
     */
    async handleParcelPaymentWebhook(metadata: Record<string, string>, amount: number) {
        const parcelId = metadata.parcelId;

        if (!parcelId) {
            throw new Error('Parcel ID not found in webhook metadata');
        }

        // Use transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // Update payment status
            await tx.payment.updateMany({
                where: {
                    parcelId,
                    status: PaymentStatus.PENDING,
                },
                data: {
                    status: PaymentStatus.SUCCESS,
                },
            });

            // Update parcel isPaid status
            const parcel = await tx.parcel.update({
                where: { id: parcelId },
                data: { isPaid: true },
            });

            // Generate rider earning if rider is assigned
            if (parcel.riderId) {
                await tx.earning.create({
                    data: {
                        riderId: parcel.riderId,
                        parcelId: parcel.id,
                        amount: parcel.price * EARNING_PERCENTAGE,
                        percentage: EARNING_PERCENTAGE,
                        status: PaymentStatus.PENDING,
                    },
                });
            }
        });
    },
};

export default parcelPaymentService;
