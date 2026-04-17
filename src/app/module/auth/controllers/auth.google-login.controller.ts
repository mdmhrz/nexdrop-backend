import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { envVars } from "../../../config/env";
import { auth } from "../../../lib/auth";
import { tokenUtils } from "../../../utils/token";
import { googleLoginService } from "../services";


// route: /api/v1/auth/login/google
// user requested route will be given to query in req.query to get user requested url
// from query route will be : /api/v1/auth/login/google?redirect=/profile

//Google Login controllers, all together for better undestanding

//01. Get Google Login Page
export const googleLoginController = catchAsync(
    async (req: Request, res: Response) => {
        const redirectPath = req.query.redirect || '/dashboard';
        const encodedRedirectPath = encodeURIComponent(redirectPath as string);

        const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

        // For now, just redirect to the google OAuth flow
        // In production, you should render a page with the callback URL
        res.json({
            message: "Use this URL for Google OAuth",
            callbackURL: callbackURL,
            googleAuthUrl: `${envVars.BETTER_AUTH_URL}/auth/google-callback`
        })
    }
);



//02. Google Login Success
export const googleLoginSuccessController = catchAsync(
    async (req: Request, res: Response) => {
        const redirectPath = req.query.redirect as string || '/dashboard';

        const sessionToken = req.cookies["better-auth.session_token"];

        if (!sessionToken) {
            return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
        }

        const session = await auth.api.getSession({
            headers: ({
                "Cookie": `better-auth.session_token=${sessionToken}`
            })
        })

        if (!session) {
            return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
        }

        if (session && !session?.user) {
            return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
        }

        const result = await googleLoginService(session);

        const { accessToken, refreshToken } = result;

        console.log(accessToken, "access token", refreshToken, "refresh token");

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);

        const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
        const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

        res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);

    }
);

//03. Google Login Failed
export const handleOAuthErrorController = catchAsync(
    async (req: Request, res: Response) => {

        const error = req.query.error as string || "oauth_failed";

        res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
    }
);
