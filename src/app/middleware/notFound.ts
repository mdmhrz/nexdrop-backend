import { Request, Response } from "express";
import path from "path";

const notFound = (req: Request, res: Response) => {
    // If API request → send JSON
    if (req.headers.accept?.includes("application/json")) {
        res.status(404).json({
            success: false,
            statusCode: 404,
            message: `Route ${req.method} ${req.originalUrl} not found`,
            errorCode: "ROUTE_NOT_FOUND",
            method: req.method,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
        });
    } else {
        // Otherwise, serve HTML page
        res.status(404).sendFile(path.join(__dirname, "../../../public/404.html"));
    }
};

export default notFound;