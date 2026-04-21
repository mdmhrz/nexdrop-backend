export interface ICashoutRequest {
    amount: number;
}

export interface ICashoutResponse {
    id: string;
    riderId: string;
    amount: number;
    status: string;
    requestedAt: Date;
    processedAt: Date | null;
}

export interface ICashoutListResponse {
    cashouts: ICashoutResponse[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ICashoutAdminListResponse {
    cashouts: ICashoutResponse[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IUpdateCashoutStatusRequest {
    status: "APPROVED" | "REJECTED" | "PAID";
}
