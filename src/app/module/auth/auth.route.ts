import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import {
    getMeController,
    loginController,
    registerController,
    changePasswordController,
    getNewTokenController,
    logoutController,
    verifyEmailController,
    forgetPasswordController,
    resetPasswordController,
    googleLoginController,
    googleLoginSuccessController,
    handleOAuthErrorController,
    resendOtpController
} from "./controllers";



const router = Router();


router.post("/register", registerController);

router.post("/login", loginController);

router.get('/me',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    getMeController
)

router.post(
    '/refresh-token',
    getNewTokenController
)

router.post(
    '/change-password',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    changePasswordController
)

router.post(
    '/logout',
    checkAuth(UserRole.ADMIN, UserRole.RIDER, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
    logoutController
)

router.post(
    '/verify-email',
    verifyEmailController
)

router.post(
    '/resend-otp',
    resendOtpController
)

router.post(
    '/forget-password',
    forgetPasswordController
)

router.post(
    '/reset-password',
    resetPasswordController
)

// google auth
router.get('/login/google', googleLoginController);
router.get('/google/success', googleLoginSuccessController);
router.get('/oauth/error', handleOAuthErrorController);




export const AuthRoutes = router;
