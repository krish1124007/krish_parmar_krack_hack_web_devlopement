
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Get student profile
const getStudentProfile = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const student = await models.Student.findById(studentId).populate("myclass", "name");

    if (!student) {
        return returnResponse(res, 404, "Student not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Profile fetched successfully", {
        success: true,
        data: student
    });
});

// Update student profile
const updateStudentProfile = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { name, enrollmentNo } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const student = await models.Student.findById(studentId);

    if (!student) {
        return returnResponse(res, 404, "Student not found", { success: false, data: null });
    }

    if (name) student.name = name;
    if (enrollmentNo) student.enrollmentNo = enrollmentNo;

    await student.save();

    return returnResponse(res, 200, "Profile updated successfully", {
        success: true,
        data: student
    });
});

// Get all available classes for explore
const getAvailableClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = await models.Class.find().populate("teacher", "name email").populate("enrolledStudents", "name email");

    return returnResponse(res, 200, "Classes fetched successfully", {
        success: true,
        data: classes
    });
});

// Enroll in a class
const enrollInClass = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { classId } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!classId) {
        return returnResponse(res, 400, "Class ID is required", { success: false, data: null });
    }

    const classDoc = await models.Class.findById(classId);
    if (!classDoc) {
        return returnResponse(res, 404, "Class not found", { success: false, data: null });
    }

    // Check if already enrolled
    if (classDoc.enrolledStudents.includes(studentId)) {
        return returnResponse(res, 400, "Already enrolled in this class", { success: false, data: null });
    }

    // Add student to class
    classDoc.enrolledStudents.push(studentId);
    await classDoc.save();

    // Update student's myclass field
    await models.Student.findByIdAndUpdate(studentId, { myclass: classId });

    return returnResponse(res, 200, "Enrolled successfully", {
        success: true,
        data: classDoc
    });
});

// Get all authority domains
const getDomains = asyncHandler(async (req: Request, res: Response) => {
    const domains = await models.AuthorityDomain.find().select("name description");

    return returnResponse(res, 200, "Domains fetched successfully", {
        success: true,
        data: domains
    });
});

export { getStudentProfile, updateStudentProfile, getAvailableClasses, enrollInClass, getDomains };
