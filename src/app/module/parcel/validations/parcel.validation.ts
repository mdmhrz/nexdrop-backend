import { z } from "zod";
import { ParcelStatus, PaymentMethod, ParcelType, ServiceType } from "../../../../generated/prisma/enums";

const BANGLADESH_DISTRICTS = [
    "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra",
    "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Cox's Bazar",
    "Comilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
    "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jessore", "Jhalokati",
    "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj",
    "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura",
    "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh",
    "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona",
    "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur",
    "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur",
    "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
] as const;

const districtSchema = z.enum(BANGLADESH_DISTRICTS, {
    message: "Invalid district. Must be a valid Bangladesh district",
});

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
    districtFrom: districtSchema,
    districtTo: districtSchema,
    weight: z.number().positive("Weight must be a positive number").max(50, "Maximum parcel weight is 50 kg"),
    parcelType: z.nativeEnum(ParcelType, { message: "Invalid parcel type" }),
    serviceType: z.nativeEnum(ServiceType, { message: "Invalid service type" }).default(ServiceType.STANDARD),
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
