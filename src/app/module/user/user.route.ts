import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
    getUsersController,
    getUserByIdController,
    updateUserRoleController,
    updateUserStatusController,
    updateMyProfileController
} from "./controllers";
import {
    updateUserRoleValidation,
    updateUserStatusValidation,
    updateMyProfileValidation
} from "./validations";

const router = Router();

// GET /users?search=email - Admin only
router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getUsersController
);

// GET /users/:id - Admin only
router.get(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getUserByIdController
);

// PATCH /users/:id/role - Super admin only
router.patch(
    '/:id/role',
    checkAuth(UserRole.SUPER_ADMIN),
    validateRequest(updateUserRoleValidation),
    updateUserRoleController
);

// PATCH /users/:id/status - Admin only
router.patch(
    '/:id/status',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(updateUserStatusValidation),
    updateUserStatusController
);

// PATCH /users/me - Authenticated user
router.patch(
    '/me',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    validateRequest(updateMyProfileValidation),
    updateMyProfileController
);

export const UserRoutes = router;
