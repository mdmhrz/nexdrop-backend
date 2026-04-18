import { ParcelStatus } from "../../../../generated/prisma/enums";

export interface IPickParcelPayload {
    note?: string;
}

export interface IDeliverParcelPayload {
    note?: string;
}

export interface IAcceptParcelPayload {
    note?: string;
}

export interface ICreateParcelPayload {
    pickupAddress: string;
    deliveryAddress: string;
    districtFrom: string;
    districtTo: string;
    price: number;
    note?: string;
}

export interface ICancelParcelPayload {
    note?: string;
}

export interface IAssignRiderPayload {
    riderId: string;
    note?: string;
}

export interface IUpdateParcelStatusPayload {
    status: ParcelStatus;
    note?: string;
}
