import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { IndexRoutes } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';


const app: Application = express();


// Set EJS as the view engine and specify the views directory
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));



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