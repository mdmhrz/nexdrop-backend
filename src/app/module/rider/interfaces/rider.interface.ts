export interface IApplyRiderAuthenticatedPayload {
    district: string;
}

export interface IApplyRiderUnauthenticatedPayload {
    name: string;
    email: string;
    password: string;
    district: string;
}

export type IApplyRiderPayload = IApplyRiderAuthenticatedPayload | IApplyRiderUnauthenticatedPayload;

export interface IRiderApplyResult {
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
    };
    rider: {
        id: string;
        userId: string;
        district: string;
        accountStatus: string;
        currentStatus: string;
        rating: number;
        totalDeliveries: number;
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface IUpdateRiderStatusPayload {
    currentStatus: string;
}
