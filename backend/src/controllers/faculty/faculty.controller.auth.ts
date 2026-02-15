import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request, Response } from "express";

const loginFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return returnResponse(res, 400, "All fields are required", { success: false, data: null });
    }

    const faculty = await models.Faculty.findOne({ email });

    if (!faculty) {
        return returnResponse(res, 404, "Faculty not found", { success: false, data: null });
    }

    const isPasswordCorrect = await (faculty as any).isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return returnResponse(res, 401, "Invalid password", { success: false, data: null });
    }

    const accessToken = (faculty as any).generateAccessToken();

    return returnResponse(res, 200, "Login successful", {
        success: true,
        data: {
            faculty,
            accessToken
        }
    });
});

export { loginFaculty };
