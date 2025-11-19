import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";


export interface AuthedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Token missing" });

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Invalid token format" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string };
        if (!decoded.userId) return res.status(401).json({ error: "Invalid token" });

        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

