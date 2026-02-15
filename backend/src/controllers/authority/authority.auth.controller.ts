import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request, Response } from "express";


const loginAuthority = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return returnResponse(res, 400, "All fields are required", { success: false, data: null });
    }

    const authority = await models.Authority.findOne({ email });

    if (!authority) {
        return returnResponse(res, 404, "Authority not found", { success: false, data: null });
    }

    const isPasswordCorrect = await (authority as any).isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return returnResponse(res, 401, "Invalid password", { success: false, data: null });
    }

    // Ensure role is set (fix for existing records without role)
    if (!authority.role) {
        authority.role = "Authority";
        await authority.save();
    }

    const accessToken = (authority as any).generateAccessToken();

    return returnResponse(res, 200, "Login successful", {
        success: true,
        data: {
            authority,
            accessToken
        }
    });
}); 

export { loginAuthority };