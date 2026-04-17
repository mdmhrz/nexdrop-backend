import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import path from 'path';
import { IndexRoutes } from './app/routes';


const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve public static files
// app.use(express.static(path.resolve(process.cwd(), 'public')));

// Basic route - Serve landing page
app.get('/', (_: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});



app.use('/api/v1', IndexRoutes)


export default app; 