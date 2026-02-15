import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { returnResponse } from "../utils/apiResponse.js";

interface AuthRequest extends Request {
    user?: any;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return returnResponse(res, 401, "Unauthorized request", { success: false, data: null });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decodedToken;
        next();
    } catch (error) {
        return returnResponse(res, 401, "Invalid Access Token", { success: false, data: null });
    }
};

export const verifyRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role?.toLowerCase();
        // console.log("THe user role is "  , userRole)
        const normalizedRoles = roles.map(r => r.toLowerCase());
        
        if (!req.user || !userRole || !normalizedRoles.includes(userRole)) {
            console.log("Access Denied. User Role:", req.user?.role, "Required Roles:", roles);
            return returnResponse(res, 403, "Forbidden: Insufficient privileges", { success: false, data: null });
        }
        next();
    };
};
