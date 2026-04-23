import { UserRole } from "../../generated/prisma/enums";

export interface IRequestUser {
    userId: string;
    email: string;
    role: UserRole;
    name?: string;
    status?: string;
    emailVerified?: boolean;
}
