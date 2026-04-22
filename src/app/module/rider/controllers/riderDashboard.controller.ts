import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getRiderDashboardService } from "../services/riderDashboard.service";

export const getRiderDashboardController = catchAsync(async (req: Request, res: Response) => {
  const dashboardData = await getRiderDashboardService(req.user!.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Rider dashboard fetched successfully",
    data: dashboardData,
  });
});
