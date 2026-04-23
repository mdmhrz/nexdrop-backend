import { z } from "zod";
import { ParcelStatus, PaymentMethod } from "../../../../generated/prisma/enums";

export const pickParcelValidation = z.object({
    note: z.string().optional()
});

export const deliverParcelValidation = z.object({
    note: z.string().optional()
});

export const acceptParcelValidation = z.object({
    note: z.string().optional()
});

export const createParcelValidation = z.object({
    pickupAddress: z.string().min(1, "Pickup address is required").max(500, "Pickup address must not exceed 500 characters"),
    deliveryAddress: z.string().min(1, "Delivery address is required").max(500, "Delivery address must not exceed 500 characters"),
    districtFrom: z.string().min(1, "District from is required").max(255, "District from must not exceed 255 characters"),
    districtTo: z.string().min(1, "District to is required").max(255, "District to must not exceed 255 characters"),
    price: z.number().positive("Price must be a positive number"),
    note: z.string().optional()
});

export const cancelParcelValidation = z.object({
    note: z.string().optional()
});

export const assignRiderValidation = z.object({
    riderId: z.string().min(1, "Rider ID is required"),
    note: z.string().optional()
});

export const updateParcelStatusValidation = z.object({
    status: z.nativeEnum(ParcelStatus),
    note: z.string().optional()
});

export const parcelPaymentValidation = z.object({
    paymentMethod: z.nativeEnum(PaymentMethod, {
        message: "Payment method must be STRIPE, MANUAL, BKASH, or SSLCOMMERZ"
    })
});
