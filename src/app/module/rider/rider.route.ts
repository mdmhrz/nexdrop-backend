import { Router } from "express";
import { riderApplyController, getRiderMeController, updateRiderStatusController } from "./controllers";
import { optionalAuth } from "../../middleware/optionalAuth";
import { checkAuth } from "../../middleware/checkAuth";

import { validateRequest } from "../../middleware/validateRequest";
import { updateRiderStatusValidation } from "./validations";
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

export const RiderRoutes = router;
