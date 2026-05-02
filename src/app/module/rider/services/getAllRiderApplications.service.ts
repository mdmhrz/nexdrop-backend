import { prisma } from "../../../lib/prisma";
import { RiderAccountStatus } from "../../../../generated/prisma/enums";
import { Prisma } from "../../../../generated/prisma/client";


export interface GetRiderApplicationsParams {
    page?: number;
    limit?: number;
    search?: string;
    accountStatus?: string;
    district?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const getAllRiderApplicationsService = async (params: GetRiderApplicationsParams) => {
    const {
        page = 1,
        limit = 10,
        search,
        accountStatus,
        district,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Build the where clause
    const where: Prisma.RiderWhereInput = {};

    if (accountStatus && Object.values(RiderAccountStatus).includes(accountStatus as RiderAccountStatus)) {
        where.accountStatus = accountStatus as RiderAccountStatus;
    }

    if (district) {
        where.district = { contains: district, mode: "insensitive" };
    }

    if (search) {
        where.user = {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        };
    }

    // Allowed sort fields to prevent injection
    const allowedSortFields = ["createdAt", "updatedAt", "rating", "totalDeliveries", "district"];
    const orderByField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [applications, total] = await Promise.all([
        prisma.rider.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [orderByField]: sortOrder },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                        emailVerified: true,
                        image: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        }),
        prisma.rider.count({ where }),
    ]);

    return {
        data: applications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
