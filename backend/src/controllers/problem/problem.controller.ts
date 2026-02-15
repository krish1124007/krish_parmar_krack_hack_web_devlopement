import type { Request, Response } from "express";
import Problem from "../../models/problem.models.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFromBuffer } from "../../utils/cloudinary.js";
import { models } from "../../admin/model.register.js";
import mongoose from "mongoose";

interface AuthRequest extends Request {
    user?: any;
}

// Create a new problem/complaint (Student only) - MUST specify domain
const createProblem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, department, priority, domainId } = req.body;
    const studentId = req.user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!title || !description || !department || !domainId) {
        return returnResponse(res, 400, "title, description, department, and domainId are required", { success: false, data: null });
    }

    // Verify domain exists
    const domain = await models.AuthorityDomain.findById(domainId);
    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    // If an uploaded file is present, upload to Cloudinary and use returned URL.
    let image = req.body.image;
    if (req.file) {
        try {
            const file: any = req.file;
            const uploadRes: any = await uploadFromBuffer(file.buffer, file.mimetype, "problems");
            image = uploadRes.secure_url;
        } catch (err) {
            console.error('Error uploading problem image:', err);
            return returnResponse(res, 500, "Image upload failed", { success: false, data: null });
        }
    }

    if (!image) {
        return returnResponse(res, 400, "Image is required", { success: false, data: null });
    }

    // Update student's domain when creating complaint
    await models.Student.findByIdAndUpdate(studentId, { domain: domainId });

    const problem = await Problem.create({
        title,
        description,
        department,
        image,
        priority: priority || "medium",
        student: studentId,
        domain: domainId
    });

    return returnResponse(res, 201, "Complaint created successfully", { success: true, data: problem });
});

// Get problems created by the logged-in student
const getStudentProblems = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const problems = await Problem.find({ student: studentId })
        .populate("domain", "name")
        .populate("authority", "name email")
        .populate("acceptedBy", "name email")
        .populate("comments.by", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Student problems fetched successfully", { success: true, data: problems });
});

// Get problems relevant to an authority's domain
const getDomainProblems = asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorityId = req.user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    // Get authority's domain from Authority model directly
    const authority = await models.Authority.findById(authorityId);
    let domainId = authority?.domain;

    if (!domainId) {
        // Fallback: Check if authority is in any domain's authorities array
        const domain = await models.AuthorityDomain.findOne({ authorities: authorityId });
        if (domain) {
            domainId = domain._id;
            // Self-repair: Update Authority with this domain
            await models.Authority.findByIdAndUpdate(authorityId, { domain: domainId });
        }
    }

    if (!domainId) {
        return returnResponse(res, 404, "Authority domain not found", { success: false, data: null });
    }

    // Get all problems for this domain
    const problems = await Problem.find({ domain: domainId })
        .populate("student", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Domain problems fetched successfully", { success: true, data: problems });
});

// Get all problems (Admin only)
const getAllProblems = asyncHandler(async (req: Request, res: Response) => {
    const problems = await Problem.find({})
        .populate("student", "name email")
        .populate("domain", "name")
        .populate("authority", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "All problems fetched successfully", { success: true, data: problems });
});

// Get problems by domain (for visibility)
const getProblemsByDomain = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { domainId } = req.params;

    // Verify domain exists
    const domain = await models.AuthorityDomain.findById(domainId);
    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    const problems = await Problem.find({ domain: new mongoose.Types.ObjectId(domainId) })
        .populate("student", "name email")
        .populate("authority", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Domain problems fetched successfully", { success: true, data: problems });
});

// Update problem status (Authority/Admin)
const updateProblemStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { problemId } = req.params;
    const { status } = req.body;

    if (!status || !["new", "progress", "resolved"].includes(status)) {
        return returnResponse(res, 400, "Invalid status", { success: false, data: null });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
        return returnResponse(res, 404, "Problem not found", { success: false, data: null });
    }

    problem.status = status;
    await problem.save();

    return returnResponse(res, 200, "Problem status updated successfully", { success: true, data: problem });
});

export {
    createProblem,
    getStudentProblems,
    getDomainProblems,
    getProblemsByDomain,
    getAllProblems,
    updateProblemStatus
};
