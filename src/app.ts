import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { IndexRoutes } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import { webhookController } from './app/module/payment/controllers';
import cors from "cors";
import { envVars } from './app/config/env';


const app: Application = express();

// Trust reverse proxy only in production (required for Vercel / any proxy layer)
// In development this causes Better Auth to set __Secure- cookie prefix on http://localhost
if (envVars.NODE_ENV === "production") {
    app.set('trust proxy', true);
}

// Set EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

// CORS must be mounted before Better Auth and all other routes
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            envVars.FRONTEND_URL,
            envVars.BETTER_AUTH_URL,
            envVars.BACKEND_URL,
            "http://localhost:3000",
            "http://localhost:5000",
            "https://nex-drop-client.vercel.app",
            "https://sandbox.sslcommerz.com",
            "https://securepay.sslcommerz.com"
        ];
        // Allow requests with no origin (server-to-server) or "null" (opaque origin from
        // payment gateway form POST redirects — SSLCommerz posts back with Origin: null)
        if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
}));

// Stripe webhook - uses express.raw() for signature verification (must be before express.json)
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), webhookController);

// Mount the authentication routes (Google OAuth, email/password, etc.)
app.use("/api/auth", toNodeHandler(auth))


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());


// Parse cookies
app.use(cookieParser());


// Serve public static files
app.use(express.static(path.resolve(process.cwd(), 'public')));

// Basic route - Serve landing page
app.get('/', (_: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});


// all define routes will be here
app.use('/api/v1', IndexRoutes)


// Not found middleware
app.use(notFound);

// Error handler middleware - must be last
app.use(globalErrorHandler)


export default app; 