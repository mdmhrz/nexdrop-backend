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
