import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getDashboardMetricsService } from "../services/dashboard.service";

export const getDashboardMetricsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getDashboardMetricsService();

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Dashboard metrics fetched successfully",
      data: result,
    });
  }
);
