import { Router } from "express";
import {
    getAvailableParcelsController,
    getAssignedParcelsController,
    pickParcelController,
    deliverParcelController,
    acceptParcelController
} from "./controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { pickParcelValidation, deliverParcelValidation, acceptParcelValidation } from "./validations";

const router = Router();

// GET /parcels/available - Get parcels available for pickup (Active Rider Only)
router.get(
    '/available',
    checkAuth(UserRole.RIDER),
    getAvailableParcelsController
);

// GET /parcels/assigned - Get parcels assigned to current rider (Active Rider Only)
router.get(
    '/assigned',
    checkAuth(UserRole.RIDER),
    getAssignedParcelsController
);

// PATCH /parcels/:id/pick - Mark parcel as picked up (Active Rider Only)
router.patch(
    '/:id/pick',
    checkAuth(UserRole.RIDER),
    validateRequest(pickParcelValidation),
    pickParcelController
);

// PATCH /parcels/:id/deliver - Mark parcel as delivered (Active Rider Only)
router.patch(
    '/:id/deliver',
    checkAuth(UserRole.RIDER),
    validateRequest(deliverParcelValidation),
    deliverParcelController
);

// PATCH /parcels/:id/accept - Accept/claim a parcel (Active Rider Only)
router.patch(
    '/:id/accept',
    checkAuth(UserRole.RIDER),
    validateRequest(acceptParcelValidation),
    acceptParcelController
);

export const ParcelRoutes = router;