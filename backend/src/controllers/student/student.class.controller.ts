import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Get all class details (lectures, notes, papers, discussions, attendance, grades)
const getClassDetails = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const studentId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    // Verify student is enrolled in this class
    const classDoc = await models.Class.findById(classId);
    if (!classDoc) {
        return returnResponse(res, 404, "Class not found", { success: false, data: null });
    }

    // Get upcoming lectures
    const lectures = await models.Lecture.find({
        class: classId as any,
        scheduledDate: { $gte: new Date() }
    })
        .populate("createdBy", "name email")
        .sort({ scheduledDate: 1 })
        .limit(10);

    // Get notes
    const notes = await models.Note.find({ class: classId as any })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

    // Get past papers
    const pastPapers = await models.PastPaper.find({ class: classId as any })
        .populate("uploadedBy", "name email")
        .sort({ year: -1, createdAt: -1 });

    // Get discussions
    const discussions = await models.Discussion.find({ class: classId as any })
        .populate("author", "name email")
        .populate({
            path: "replies",
            populate: { path: "author", select: "name email" }
        })
        .sort({ createdAt: -1 });

    // Get student's attendance records
    const attendance = await models.Attendance.find({
        class: classId as any,
        $or: [
            { presentStudents: studentId },
            { absentStudents: studentId }
        ]
    })
        .populate("markedBy", "name")
        .sort({ date: -1 });

    // Get student's grades
    const grades = await models.Grade.find({
        student: studentId,
        class: classId as any
    })
        .populate("enteredBy", "name")
        .sort({ date: -1 });

    return returnResponse(res, 200, "Class details fetched successfully", {
        success: true,
        data: {
            class: classDoc,
            lectures,
            notes,
            pastPapers,
            discussions,
            attendance,
            grades
        }
    });
});

// Add a note
const addNote = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { title, description, driveLink } = req.body;
    const userId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    if (!title || !driveLink) {
        return returnResponse(res, 400, "Title and drive link are required", { success: false, data: null });
    }

    const note = await models.Note.create({
        title,
        description,
        driveLink,
        class: classId as any,
        uploadedBy: userId,
        uploaderType: 'Student'
    });

    await note.populate("uploadedBy", "name email");

    return returnResponse(res, 201, "Note added successfully", {
        success: true,
        data: note
    });
});

// Add a past paper
const addPastPaper = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { title, year, semester, driveLink } = req.body;
    const userId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    if (!title || !driveLink) {
        return returnResponse(res, 400, "Title and drive link are required", { success: false, data: null });
    }

    const pastPaper = await models.PastPaper.create({
        title,
        year,
        semester,
        driveLink,
        class: classId as any,
        uploadedBy: userId,
        uploaderType: 'Student'
    });

    await pastPaper.populate("uploadedBy", "name email");

    return returnResponse(res, 201, "Past paper added successfully", {
        success: true,
        data: pastPaper
    });
});

// Add a discussion
const addDiscussion = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { message } = req.body;
    const userId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    if (!message) {
        return returnResponse(res, 400, "Message is required", { success: false, data: null });
    }

    const discussion = await models.Discussion.create({
        message,
        class: classId as any,
        author: userId,
        authorType: 'Student',
        replies: []
    });

    await discussion.populate("author", "name email");

    return returnResponse(res, 201, "Discussion created successfully", {
        success: true,
        data: discussion
    });
});

// Add a reply to discussion
const addReply = asyncHandler(async (req: Request, res: Response) => {
    const { discussionId } = req.params;
    const { message } = req.body;
    const userId = (req as any).user?._id;

    if (!discussionId || typeof discussionId !== 'string') {
        return returnResponse(res, 400, "Valid Discussion ID is required", { success: false, data: null });
    }

    if (!message) {
        return returnResponse(res, 400, "Message is required", { success: false, data: null });
    }

    const reply = await models.Reply.create({
        message,
        discussion: discussionId as any,
        author: userId,
        authorType: 'Student'
    });

    await reply.populate("author", "name email");

    // Add reply to discussion
    await models.Discussion.findByIdAndUpdate(discussionId, {
        $push: { replies: reply._id }
    });

    return returnResponse(res, 201, "Reply added successfully", {
        success: true,
        data: reply
    });
});

export {
    getClassDetails,
    addNote,
    addPastPaper,
    addDiscussion,
    addReply
};
