import { UserRole, UserStatus } from "../../../../generated/prisma/enums";

export interface IUpdateUserRolePayload {
    role: UserRole;
}

export interface IUpdateUserStatusPayload {
    status: UserStatus;
}

export interface IUpdateMyProfilePayload {
    name?: string;
    phone?: string;
}
