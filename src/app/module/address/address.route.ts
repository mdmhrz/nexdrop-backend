import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
    getAddressesController,
    createAddressController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController
} from "./controllers";
import {
    createAddressValidation,
    updateAddressValidation
} from "./validations";

const router = Router();

// GET /addresses - Authenticated user
router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    getAddressesController
);

// POST /addresses - Authenticated user
router.post(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    validateRequest(createAddressValidation),
    createAddressController
);

// PATCH /addresses/:id - Authenticated user
router.patch(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    validateRequest(updateAddressValidation),
    updateAddressController
);

// DELETE /addresses/:id - Authenticated user
router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    deleteAddressController
);

// PATCH /addresses/:id/default - Authenticated user
router.patch(
    '/:id/default',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    setDefaultAddressController
);

export const AddressRoutes = router;
