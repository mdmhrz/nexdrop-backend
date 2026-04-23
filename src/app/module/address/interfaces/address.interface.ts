export interface ICreateAddressPayload {
    label: string;
    address: string;
    district: string;
    phone?: string;
    isDefault?: boolean;
}

export interface IUpdateAddressPayload {
    label?: string;
    address?: string;
    district?: string;
    phone?: string;
    isDefault?: boolean;
}
