import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request, Response } from "express";

// Get faculty's classes
const getFacultyClasses = asyncHandler(async (req: Request, res: Response) => {
    const facultyId = (req as any).user?._id;

    if (!facultyId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const classes = await models.Class.find({ teacher: facultyId }).populate("enrolledStudents", "name email");

    return returnResponse(res, 200, "Classes fetched successfully", {
        success: true,
        data: classes
    });
});

export { getFacultyClasses };
