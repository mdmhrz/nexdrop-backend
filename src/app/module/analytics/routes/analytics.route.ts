import { Router } from "express";
import { getRevenueAnalyticsController, getDashboardMetricsController } from "../controllers";
import { checkAuth } from "../../../middleware/checkAuth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

// GET /analytics/revenue - Get revenue analytics (Admin & Super Admin Only)
router.get(
  "/revenue",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getRevenueAnalyticsController
);

// GET /analytics/dashboard - Get dashboard metrics (Admin & Super Admin Only)
router.get(
  "/dashboard",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getDashboardMetricsController
);

export const AnalyticsRoutes = router;
