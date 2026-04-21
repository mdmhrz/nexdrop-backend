import { Router } from "express";
import { riderApplyController, getRiderMeController, updateRiderStatusController, getCurrentEarningsController, getEarningsHistoryController, requestCashoutController, getMyCashoutsController, getAllCashoutsController, updateCashoutStatusController } from "./controllers";
import { optionalAuth } from "../../middleware/optionalAuth";
import { checkAuth } from "../../middleware/checkAuth";

import { validateRequest } from "../../middleware/validateRequest";
import { updateRiderStatusValidation, requestCashoutValidation, getCashoutsValidation, updateCashoutStatusValidation } from "./validations";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

// POST /rider/apply - Public + Authenticated (both allowed)
// Use optionalAuth - validates token if present but doesn't require it
router.post(
    '/apply',
    optionalAuth(),
    riderApplyController
);

// GET /rider/me - Rider Status (Authenticated Rider Only)
router.get(
    '/me',
    checkAuth(UserRole.RIDER, UserRole.CUSTOMER),
    getRiderMeController
);

// PATCH /rider/status - Rider Self Control (Active Rider Only)
router.patch(
    '/status',
    checkAuth(UserRole.RIDER),
    validateRequest(updateRiderStatusValidation),
    updateRiderStatusController
);

// GET /rider/earnings/me - Current Earnings (Active Rider Only)
router.get(
    '/earnings/me',
    checkAuth(UserRole.RIDER),
    getCurrentEarningsController
);

// GET /rider/earnings/history - Earnings History (Active Rider Only)
router.get(
    '/earnings/history',
    checkAuth(UserRole.RIDER),
    getEarningsHistoryController
);

// POST /rider/cashouts/request - Request Cashout (Active Rider Only)
router.post(
    '/cashouts/request',
    checkAuth(UserRole.RIDER),
    validateRequest(requestCashoutValidation),
    requestCashoutController
);

// GET /rider/cashouts/me - Get My Cashouts (Active Rider Only)
router.get(
    '/cashouts/me',
    checkAuth(UserRole.RIDER),
    getMyCashoutsController
);

// GET /cashouts - Get All Cashouts (Admin Only)
router.get(
    '/cashouts',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getAllCashoutsController
);

// PATCH /cashouts/:id - Update Cashout Status (Admin Only)
router.patch(
    '/cashouts/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateCashoutStatusValidation),
    updateCashoutStatusController
);

export const RiderRoutes = router;
