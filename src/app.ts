import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';


const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', async (req: Request, res: Response) => {
    const stats = await prisma.statsCache.findFirst();
    res.status(200).json(stats);
});


export default app; 