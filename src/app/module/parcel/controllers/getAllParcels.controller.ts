import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getAllParcelsService } from "../services";
import { getPaginationParams } from "../../../shared/pagination";
import { ParcelStatus } from "../../../../generated/prisma/enums";

export const getAllParcelsController = catchAsync(
    async (req: Request, res: Response) => {
        const { page, limit } = getPaginationParams(
            req.query.page ? String(req.query.page) : undefined,
            req.query.limit ? String(req.query.limit) : undefined
        );

        const statusFilter = req.query.status as ParcelStatus;
        const districtFilter = req.query.district as string;
        const dateFilter = req.query.date as string;

        const result = await getAllParcelsService(
            page,
            limit,
            statusFilter,
            districtFilter,
            dateFilter
        );

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Parcels fetched successfully",
            data: result.data,
            meta: result.meta
        });
    }
)
