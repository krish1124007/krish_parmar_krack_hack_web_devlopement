import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { readExcelFile } from "../../utils/xcell.js";
import { models } from "../../admin/model.register.js";
import fs from "fs";




const createFaculty = asyncHandler(async (req: Request, res: Response) => {

    const { email, name } = req.body;

    // if (!email.includes(".iit.ac.in")) {
    //     return returnResponse(res, 400, "Invalid email", { success: false, data: null });
    // }

    const password = email.substring(0, 3) + "@123";

    const faculty = await models.Faculty.create({
        email,
        name,
        password
    })

    if (!faculty) {
        return returnResponse(res, 400, "Faculty not created", { success: false, data: null });
    }

    return returnResponse(res, 200, "Faculty created successfully", { success: true, data: faculty });
})

const createClass = asyncHandler(async (req: Request, res: Response) => {

    const { name, teacherId } = req.body;

    const newClass = await models.Class.create({
        name,
        teacher: teacherId,
        enrolledStudents: []
    });

    if (!newClass) {
        return returnResponse(res, 500, "Class creation failed", { success: false, data: null });
    }

    return returnResponse(res, 200, "Class created successfully", { success: true, data: newClass });
})

const bulkCreateStudents = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        return returnResponse(res, 400, "File not found", { success: false, data: null });
    }

    let data;
    try {
        // Use buffer if available (memoryStorage), otherwise use path (diskStorage)
        const fileData = file.buffer || file.path;
        if (!fileData) {
            return returnResponse(res, 400, "File data is missing", { success: false, data: null });
        }
        data = readExcelFile(fileData);
    } catch (error: any) {
        console.error("Error reading Excel file:", error);
        return returnResponse(res, 400, "Failed to read Excel file: " + error.message, { success: false, data: null });
    }

    // cleanup file if it was on disk
    if (file.path) {
        try {
            fs.unlinkSync(file.path);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }

    if (!data || data.length === 0) {
        return returnResponse(res, 400, "No data found in file", { success: false, data: null });
    }

    let createdCount = 0;
    const errors = [];

    for (const d of data) {
        const email = d.emailid?.trim();
        const studentName = d.name?.trim() ? d.name.trim() : (email ? email.split('@')[0] : 'Student');

        if (!email) continue;

        try {
            // Check if student already exists
            const existingStudent = await models.Student.findOne({ email });
            if (existingStudent) continue;

            const password = email.substring(0, 3) + "@123";

            await models.Student.create({
                name: studentName as string,
                email,
                password
            });
            createdCount++;
        } catch (error: any) {
            errors.push({ email, error: error.message });
        }
    }

    return returnResponse(res, 200, `Bulk creation completed. Created ${createdCount} students.`, {
        success: true,
        data: { createdCount, errors }
    });
});

const createStudent = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, classId } = req.body;

    if (!email || !name) {
        return returnResponse(res, 400, "Name and Email are required", { success: false, data: null });
    }

    // Check if student already exists
    const existingStudent = await models.Student.findOne({ email });
    if (existingStudent) {
        return returnResponse(res, 400, "Student already exists", { success: false, data: null });
    }

    const password = email.substring(0, 3) + "@123"; // Default password logic

    const studentData: any = {
        name,
        email,
        password
    };

    if (classId) {
        studentData.myclass = classId;
    }

    const student = await models.Student.create(studentData);

    if (!student) {
        return returnResponse(res, 500, "Student creation failed", { success: false, data: null });
    }

    return returnResponse(res, 201, "Student created successfully", { success: true, data: student });
});

// --- Faculty Management ---
const getAllFaculties = asyncHandler(async (req: Request, res: Response) => {
    const faculties = await models.Faculty.find();
    // console.log(faculties)
    return returnResponse(res, 200, "All faculties fetched successfully", { success: true, data: faculties });
});

const deleteFaculty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedFaculty = await models.Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
        return returnResponse(res, 404, "Faculty not found", { success: false, data: null });
    }
    return returnResponse(res, 200, "Faculty deleted successfully", { success: true, data: deletedFaculty });
});

// --- Authority Management ---
const getAllAuthorities = asyncHandler(async (req: Request, res: Response) => {
    const authorities = await models.Authority.find();
    return returnResponse(res, 200, "All authorities fetched successfully", { success: true, data: authorities });
});

const deleteAuthority = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedAuthority = await models.Authority.findByIdAndDelete(id);
    if (!deletedAuthority) {
        return returnResponse(res, 404, "Authority not found", { success: false, data: null });
    }
    return returnResponse(res, 200, "Authority deleted successfully", { success: true, data: deletedAuthority });
});

// --- Student Management ---
const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
    const students = await models.Student.find();
    return returnResponse(res, 200, "All students fetched successfully", { success: true, data: students });
});

const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedStudent = await models.Student.findByIdAndDelete(id);
    if (!deletedStudent) {
        return returnResponse(res, 404, "Student not found", { success: false, data: null });
    }
    return returnResponse(res, 200, "Student deleted successfully", { success: true, data: deletedStudent });
});

// --- Class Management ---
const getAllClasses = asyncHandler(async (req: Request, res: Response) => {
    const classes = await models.Class.find();
    return returnResponse(res, 200, "All classes fetched successfully", { success: true, data: classes });
});

const deleteClass = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedClass = await models.Class.findByIdAndDelete(id);
    if (!deletedClass) {
        return returnResponse(res, 404, "Class not found", { success: false, data: null });
    }
    return returnResponse(res, 200, "Class deleted successfully", { success: true, data: deletedClass });
});

const sendWorkReportToAuthority = asyncHandler(async (req: Request, res: Response) => {
    const { authorityId } = req.body;

    // Get authority details
    const authority = await models.Authority.findById(authorityId);
    if (!authority) {
        return returnResponse(res, 404, "Authority not found", { success: false, data: null });
    }

    // Gather work statistics
    const totalClasses = await models.Class.countDocuments();
    const totalStudents = await models.Student.countDocuments();
    const totalFaculty = await models.Faculty.countDocuments();
    const totalAuthorities = await models.Authority.countDocuments();

    // Get classes with no teacher assigned
    const classesWithoutTeacher = await models.Class.find({ teacher: null }).countDocuments();

    // Get classes with no students
    const classesWithoutStudents = await models.Class.find({
        $or: [
            { enrolledStudents: { $exists: false } },
            { enrolledStudents: { $size: 0 } }
        ]
    }).countDocuments();

    // Get recent classes (created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentClasses = await models.Class.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    // Prepare email content
    const emailSubject = `Work Report - Academic Management System`;
    const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .metric-card { background: white; margin: 15px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .metric-title { font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600; }
                .metric-value { font-size: 32px; color: #0f172a; font-weight: 700; margin: 10px 0; }
                .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px; }
                .warning-title { color: #92400e; font-weight: 600; margin-bottom: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
                .status-pending { color: #dc2626; font-weight: 600; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Work Status Report</h1>
                    <p>Academic Management System</p>
                </div>
                <div class="content">
                    <p>Dear ${authority.name},</p>
                    <p>Here is the current work status report for your review:</p>
                    
                    <h2 style="color: #0f172a; margin-top: 30px;">System Overview</h2>
                    <div class="grid">
                        <div class="metric-card">
                            <div class="metric-title">Total Classes</div>
                            <div class="metric-value">${totalClasses}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-title">Total Students</div>
                            <div class="metric-value">${totalStudents}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-title">Total Faculty</div>
                            <div class="metric-value">${totalFaculty}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-title">Total Authorities</div>
                            <div class="metric-value">${totalAuthorities}</div>
                        </div>
                    </div>

                    <h2 style="color: #0f172a; margin-top: 30px;">⚠️ Pending Tasks</h2>
                    
                    ${classesWithoutTeacher > 0 ? `
                        <div class="warning">
                            <div class="warning-title">Classes Without Teacher</div>
                            <div><span class="status-pending">${classesWithoutTeacher} class(es)</span> need teacher assignment</div>
                        </div>
                    ` : ''}
                    
                    ${classesWithoutStudents > 0 ? `
                        <div class="warning">
                            <div class="warning-title">Empty Classes</div>
                            <div><span class="status-pending">${classesWithoutStudents} class(es)</span> have no enrolled students</div>
                        </div>
                    ` : ''}

                    ${classesWithoutTeacher === 0 && classesWithoutStudents === 0 ? `
                        <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px;">
                            <div style="color: #065f46; font-weight: 600;">✅ All tasks completed!</div>
                            <div style="color: #047857;">No pending work at this moment.</div>
                        </div>
                    ` : ''}

                    <h2 style="color: #0f172a; margin-top: 30px;">📈 Recent Activity</h2>
                    <div class="metric-card">
                        <div class="metric-title">New Classes (Last 7 Days)</div>
                        <div class="metric-value">${recentClasses}</div>
                    </div>

                    <div class="footer">
                        <p>Report generated on ${new Date().toLocaleString()}</p>
                        <p>Academic Management System - Automated Report</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    // Import and send email
    const { sendMail } = await import("../../utils/sendMail.js");

    try {
        await sendMail({
            to: authority.email,
            subject: emailSubject,
            html: emailHtml
        });

        return returnResponse(res, 200, "Work report sent successfully", {
            success: true,
            data: {
                sentTo: authority.email,
                metrics: {
                    totalClasses,
                    totalStudents,
                    totalFaculty,
                    totalAuthorities,
                    classesWithoutTeacher,
                    classesWithoutStudents,
                    recentClasses
                }
            }
        });
    } catch (error) {
        console.error("Error sending work report:", error);
        return returnResponse(res, 500, "Failed to send work report", { success: false, data: null });
    }
});



export {
    createFaculty,
    createClass,
    createStudent,
    bulkCreateStudents,
    getAllFaculties,
    deleteFaculty,
    getAllAuthorities,
    deleteAuthority,
    getAllStudents,
    deleteStudent,
    getAllClasses,
    deleteClass,
    sendWorkReportToAuthority
}


