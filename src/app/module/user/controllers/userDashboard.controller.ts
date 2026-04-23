import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { getUserDashboardService } from "../services/userDashboard.service";

export const getUserDashboardController = catchAsync(async (req: Request, res: Response) => {
  const dashboardData = await getUserDashboardService(req.user!.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User dashboard fetched successfully",
    data: dashboardData,
  });
});
