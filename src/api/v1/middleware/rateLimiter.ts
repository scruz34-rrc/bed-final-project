import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
            success: false,
            error: {
                message: "Too many requests, please try again later.",
                code: "RATE_LIMIT_EXCEEDED",
            },
            timestamp: new Date().toISOString()
        });
    },
});