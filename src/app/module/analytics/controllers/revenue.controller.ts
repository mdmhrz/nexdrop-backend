import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getRevenueAnalyticsService } from "../services/revenue.service";

export const getRevenueAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getRevenueAnalyticsService(req.query);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Revenue analytics fetched successfully",
      data: result,
    });
  }
);
