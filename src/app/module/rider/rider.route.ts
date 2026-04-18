import { Router } from "express";
import { riderApplyController } from "./controllers";
import { optionalAuth } from "../../middleware/optionalAuth";

const router = Router();

// POST /rider/apply - Public + Authenticated (both allowed)
// Use optionalAuth - validates token if present but doesn't require it
router.post(
    '/apply',
    optionalAuth(),
    riderApplyController
);

export const RiderRoutes = router;
