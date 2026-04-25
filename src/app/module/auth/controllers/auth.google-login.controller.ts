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
        // res.json({
        //     message: "Use this URL for Google OAuth",
        //     callbackURL: callbackURL,
        //     googleAuthUrl: `${envVars.BETTER_AUTH_URL}/auth/google-callback`
        // })

        res.render("googleRedirect", {
            callbackURL: callbackURL,
            betterAuthUrl: envVars.BETTER_AUTH_URL
        })
    }
);



//02. Google Login Success
export const googleLoginSuccessController = catchAsync(
    async (req: Request, res: Response) => {
        const redirectPath = req.query.redirect as string || '/dashboard';

        // Better Auth appends ?error=<code> to the callbackURL when OAuth fails
        const oauthError = req.query.error as string | undefined;
        if (oauthError) {
            console.error("[Google OAuth] Better Auth callback error:", oauthError, req.query);
            return res.redirect(`${envVars.FRONTEND_URL}/login?error=${encodeURIComponent(oauthError)}`);
        }

        const sessionToken = req.cookies["better-auth.session_token"]
            ?? req.cookies["__Secure-better-auth.session_token"]
            // fallback: parse raw Cookie header in case cookieParser missed it
            ?? req.headers.cookie?.split(";").find(c => c.trim().startsWith("better-auth.session_token="))?.split("=").slice(1).join("=").trim()
            ?? req.headers.cookie?.split(";").find(c => c.trim().startsWith("__Secure-better-auth.session_token="))?.split("=").slice(1).join("=").trim();

        // Debug: log what cookies arrived (remove after confirming it works)
        console.log("[Google OAuth] Cookies received:", Object.keys(req.cookies));

        if (!sessionToken) {
            console.error("[Google OAuth] No session token cookie found. Available cookies:", req.cookies);
            return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
        }

        // Build the Cookie header with whichever name was actually set
        const isSecurePrefix = !!req.cookies["__Secure-better-auth.session_token"];
        const cookieName = isSecurePrefix
            ? "__Secure-better-auth.session_token"
            : "better-auth.session_token";

        const session = await auth.api.getSession({
            headers: {
                "Cookie": `${cookieName}=${sessionToken}`
            }
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
