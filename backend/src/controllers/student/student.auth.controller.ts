import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return returnResponse(res, 400, "Email and password are required", { success: false, data: null });
    }

    // Find student by email
    let student = await models.Student.findOne({ email });

    if (!student) {
        return returnResponse(res, 404, "Student not found. Please contact your administrator.", { success: false, data: null });
    }

    // Verify password
    const isPasswordCorrect = await (student as any).isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return returnResponse(res, 401, "Invalid password", { success: false, data: null });
    }

    // Generate access token
    const accessToken = (student as any).generateAccessToken();

    // Populate student class to send back full details
    await student.populate("myclass", "name");

    if (!accessToken) {
        return returnResponse(res, 500, "Failed to generate access token", { success: false, data: null });
    }

    return returnResponse(res, 200, "Login successful", {
        success: true,
        data: {
            student,
            accessToken
        }
    });
});

export { login };
