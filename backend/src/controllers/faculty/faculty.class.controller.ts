import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Add a lecture
const addLecture = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { title, description, scheduledDate, duration } = req.body;
    const facultyId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    if (!title || !scheduledDate) {
        return returnResponse(res, 400, "Title and scheduled date are required", { success: false, data: null });
    }

    const lecture = await models.Lecture.create({
        title,
        description,
        scheduledDate,
        duration: duration || 60,
        class: classId as any,
        createdBy: facultyId,
        status: 'scheduled'
    });

    await lecture.populate("createdBy", "name email");

    return returnResponse(res, 201, "Lecture added successfully", {
        success: true,
        data: lecture
    });
});

// Mark attendance
const markAttendance = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { date, presentStudents, lectureId } = req.body;
    const facultyId = (req as any).user?._id;

    if (!presentStudents || !Array.isArray(presentStudents)) {
        return returnResponse(res, 400, "Present students array is required", { success: false, data: null });
    }

    // Get all enrolled students
    const classDoc = await models.Class.findById(classId).populate("enrolledStudents");
    if (!classDoc) {
        return returnResponse(res, 404, "Class not found", { success: false, data: null });
    }

    const allStudentIds = (classDoc.enrolledStudents as any[]).map(s => s._id.toString());
    const presentIds = presentStudents.map(id => id.toString());
    const absentIds = allStudentIds.filter(id => !presentIds.includes(id));

    const attendance = await models.Attendance.create({
        class: classId as any,
        date: date || new Date(),
        lecture: lectureId,
        presentStudents: presentIds,
        absentStudents: absentIds,
        markedBy: facultyId
    });

    await attendance.populate("presentStudents absentStudents markedBy", "name email");

    return returnResponse(res, 201, "Attendance marked successfully", {
        success: true,
        data: attendance
    });
});

// Add grade/marks
const addGrade = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { studentId, title, marks, maxMarks, type, remarks } = req.body;
    const facultyId = (req as any).user?._id;

    if (!studentId || !title || marks === undefined || maxMarks === undefined || !type) {
        return returnResponse(res, 400, "All required fields must be provided", { success: false, data: null });
    }

    const grade = await models.Grade.create({
        student: studentId,
        class: classId as any,
        title,
        marks,
        maxMarks,
        type,
        remarks,
        enteredBy: facultyId
    });

    await grade.populate("student enteredBy", "name email");

    return returnResponse(res, 201, "Grade added successfully", {
        success: true,
        data: grade
    });
});

// Bulk add grades (for all students at once)
const bulkAddGrades = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { title, maxMarks, type, grades, remarks } = req.body; // grades: [{ studentId, marks, remarks }]
    const facultyId = (req as any).user?._id;

    if (!title || !maxMarks || !type || !grades || !Array.isArray(grades)) {
        return returnResponse(res, 400, "All required fields must be provided", { success: false, data: null });
    }

    const gradeDocuments = grades.map(g => ({
        student: g.studentId,
        class: classId as any,
        title,
        marks: g.marks,
        maxMarks,
        type,
        remarks: g.remarks || remarks,
        enteredBy: facultyId
    }));

    const createdGrades = await models.Grade.insertMany(gradeDocuments);

    return returnResponse(res, 201, `${createdGrades.length} grades added successfully`, {
        success: true,
        data: { count: createdGrades.length, grades: createdGrades }
    });
});

// Add note (faculty)
const addNote = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { title, description, driveLink } = req.body;
    const facultyId = (req as any).user?._id;

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
        uploadedBy: facultyId,
        uploaderType: 'Faculty'
    });

    await note.populate("uploadedBy", "name email");

    return returnResponse(res, 201, "Note added successfully", {
        success: true,
        data: note
    });
});

// Add discussion (faculty)
const addDiscussion = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { message } = req.body;
    const facultyId = (req as any).user?._id;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    if (!message) {
        return returnResponse(res, 400, "Message is required", { success: false, data: null });
    }

    const discussion = await models.Discussion.create({
        message,
        class: classId as any,
        author: facultyId,
        authorType: 'Faculty',
        replies: []
    });

    await discussion.populate("author", "name email");

    return returnResponse(res, 201, "Discussion created successfully", {
        success: true,
        data: discussion
    });
});

// Add reply to discussion (faculty)
const addReply = asyncHandler(async (req: Request, res: Response) => {
    const { discussionId } = req.params;
    const { message } = req.body;
    const facultyId = (req as any).user?._id;

    if (!discussionId || typeof discussionId !== 'string') {
        return returnResponse(res, 400, "Valid Discussion ID is required", { success: false, data: null });
    }

    if (!message) {
        return returnResponse(res, 400, "Message is required", { success: false, data: null });
    }

    const reply = await models.Reply.create({
        message,
        discussion: discussionId as any,
        author: facultyId,
        authorType: 'Faculty'
    });

    await reply.populate("author", "name email");

    await models.Discussion.findByIdAndUpdate(discussionId, {
        $push: { replies: reply._id }
    });

    return returnResponse(res, 201, "Reply added successfully", {
        success: true,
        data: reply
    });
});

// Get class details with all resources
const getClassDetails = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;

    if (!classId || typeof classId !== 'string') {
        return returnResponse(res, 400, "Valid Class ID is required", { success: false, data: null });
    }

    const classDoc = await models.Class.findById(classId).populate("enrolledStudents teacher", "name email");
    if (!classDoc) {
        return returnResponse(res, 404, "Class not found", { success: false, data: null });
    }

    const lectures = await models.Lecture.find({ class: classId as any })
        .populate("createdBy", "name email")
        .sort({ scheduledDate: -1 });

    const notes = await models.Note.find({ class: classId as any })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

    const pastPapers = await models.PastPaper.find({ class: classId as any })
        .populate("uploadedBy", "name email")
        .sort({ year: -1, createdAt: -1 });

    const discussions = await models.Discussion.find({ class: classId as any })
        .populate("author", "name email")
        .populate({
            path: "replies",
            populate: { path: "author", select: "name email" }
        })
        .sort({ createdAt: -1 });

    const attendance = await models.Attendance.find({ class: classId as any })
        .populate("presentStudents absentStudents markedBy", "name email")
        .sort({ date: -1 });

    const grades = await models.Grade.find({ class: classId as any })
        .populate("student enteredBy", "name email")
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

export {
    addLecture,
    markAttendance,
    addGrade,
    bulkAddGrades,
    addNote,
    addDiscussion,
    addReply,
    getClassDetails
};
