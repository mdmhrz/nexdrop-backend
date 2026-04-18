import { Router } from "express";
import {
    getAvailableParcelsController,
    getAssignedParcelsController,
    pickParcelController,
    deliverParcelController,
    acceptParcelController,
    createParcelController,
    getMyParcelsController,
    getParcelByIdController,
    cancelParcelController,
    getAllParcelsController,
    assignRiderController,
    updateParcelStatusController
} from "./controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
    pickParcelValidation,
    deliverParcelValidation,
    acceptParcelValidation,
    createParcelValidation,
    cancelParcelValidation,
    assignRiderValidation,
    updateParcelStatusValidation
} from "./validations";

const router = Router();

// Customer Routes
// POST /parcels - Create a new parcel (Customer Only)
router.post(
    '/',
    checkAuth(UserRole.CUSTOMER),
    validateRequest(createParcelValidation),
    createParcelController
);

// GET /parcels/my - Get parcels belonging to authenticated customer (Customer Only)
router.get(
    '/my',
    checkAuth(UserRole.CUSTOMER),
    getMyParcelsController
);

// Rider and admin Routes
// GET /parcels/available - Get parcels available for pickup (Active Rider Only)
router.get(
    '/available',
    checkAuth(UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.ADMIN),
    getAvailableParcelsController
);

// GET /parcels/assigned - Get parcels assigned to current rider (Active Rider Only)
router.get(
    '/assigned',
    checkAuth(UserRole.RIDER),
    getAssignedParcelsController
);

// Admin Routes
// GET /parcels - Get all parcels with filters (Admin & Super Admin Only)
router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getAllParcelsController
);

// PATCH /parcels/:id/cancel - Cancel a parcel (Customer Only)
router.patch(
    '/:id/cancel',
    checkAuth(UserRole.CUSTOMER),
    validateRequest(cancelParcelValidation),
    cancelParcelController
);

// PATCH /parcels/:id/assign-rider - Assign a rider to a parcel (Admin & Super Admin Only)
router.patch(
    '/:id/assign-rider',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(assignRiderValidation),
    assignRiderController
);

// PATCH /parcels/:id/status - Update parcel status (Admin & Super Admin Only)
router.patch(
    '/:id/status',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateParcelStatusValidation),
    updateParcelStatusController
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

// GET /parcels/:id - Get a specific parcel by ID (Customer, Rider, Admin & Super Admin) - Must be last
router.get(
    '/:id',
    checkAuth(UserRole.CUSTOMER, UserRole.RIDER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getParcelByIdController
);

export const ParcelRoutes = router;