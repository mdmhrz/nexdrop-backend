import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getAllRiderApplicationsService } from "../services/getAllRiderApplications.service";

export const getAllRiderApplicationsController = catchAsync(
    async (req: Request, res: Response) => {
        const {
            page,
            limit,
            search,
            accountStatus,
            district,
            sortBy,
            sortOrder,
        } = req.query;

        const result = await getAllRiderApplicationsService({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search as string | undefined,
            accountStatus: accountStatus as string | undefined,
            district: district as string | undefined,
            sortBy: sortBy as string | undefined,
            sortOrder: (sortOrder as "asc" | "desc") || undefined,
        });

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Rider applications fetched successfully",
            data: result.data,
            meta: result.meta,
        });
    }
);
