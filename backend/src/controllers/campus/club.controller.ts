import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Create club
const createClub = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, advisor, leader } = req.body;

    if (!name || !description || !advisor || !leader) {
        return returnResponse(res, 400, "Required fields missing", { success: false, data: null });
    }

    const logo = (req as any).files?.logo?.[0]?.path || null;
    const banner = (req as any).files?.banner?.[0]?.path || null;

    const existingClub = await models.Club.findOne({ name });
    if (existingClub) {
        return returnResponse(res, 400, "Club already exists", { success: false, data: null });
    }

    // Find advisor by email if string
    let advisorId = advisor;
    if (typeof advisor === 'string' && advisor.includes('@')) {
        const adv = await models.Faculty.findOne({ email: advisor });
        if (!adv) return returnResponse(res, 404, "Advisor not found with that email", { success: false, data: null });
        advisorId = adv._id;
    }

    // Find leader by email if string
    let leaderId = leader;
    if (typeof leader === 'string' && leader.includes('@')) {
        const lead = await models.Student.findOne({ email: leader });
        if (!lead) return returnResponse(res, 404, "Leader (Student) not found with that email", { success: false, data: null });
        leaderId = lead._id;
    }

    const club = await models.Club.create({
        name,
        description,
        logo,
        banner,
        advisor: advisorId,
        leader: leaderId,
        members: [leaderId],
        events: [],
        announcements: [],
        gallery: []
    });

    const populatedClub = await models.Club.findById(club._id)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 201, "Club created successfully", {
        success: true,
        data: populatedClub
    });
});

// Get all clubs
const getAllClubs = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;
    const filter: any = {};

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const clubs = await models.Club.find(filter)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo")
        .populate("events");

    return returnResponse(res, 200, "Clubs fetched successfully", {
        success: true,
        data: clubs
    });
});

// Get single club
const getClub = asyncHandler(async (req: Request, res: Response) => {
    const { clubId } = req.params;

    const club = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo")
        .populate("pendingMembers", "name email enrollmentNo")
        .populate("events");

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Club fetched successfully", {
        success: true,
        data: club
    });
});

// Join club request
const joinClub = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (club.members.includes(studentId)) {
        return returnResponse(res, 400, "Already a member", { success: false, data: null });
    }

    if (club.pendingMembers?.includes(studentId)) {
        return returnResponse(res, 400, "Join request already pending", { success: false, data: null });
    }

    club.pendingMembers.push(studentId);
    await club.save();

    const updatedClub = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 200, "Join request sent successfully", {
        success: true,
        data: updatedClub
    });
});

// Leave club
const leaveClub = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (!club.members.includes(studentId)) {
        return returnResponse(res, 400, "Not a member", { success: false, data: null });
    }

    club.members = club.members.filter(id => id.toString() !== studentId);
    await club.save();

    const updatedClub = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 200, "Left club successfully", {
        success: true,
        data: updatedClub
    });
});

// Add announcement
const addAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const { clubId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return returnResponse(res, 400, "Title and content are required", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    club.announcements.push({
        title,
        content,
        date: new Date()
    });

    await club.save();

    const updatedClub = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 201, "Announcement added successfully", {
        success: true,
        data: updatedClub
    });
});

// Add to gallery
const addToGallery = asyncHandler(async (req: Request, res: Response) => {
    const { clubId } = req.params;

    if (!req.file) {
        return returnResponse(res, 400, "Image is required", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    club.gallery.push((req as any).file.path);
    await club.save();

    const updatedClub = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 201, "Image added to gallery", {
        success: true,
        data: updatedClub
    });
});

// Update club (leader/advisor only)
const updateClub = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId } = req.params;
    const { name, description } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (club.leader.toString() !== studentId) {
        return returnResponse(res, 403, "Only leader can update club details", { success: false, data: null });
    }

    if (name) club.name = name;
    if (description) club.description = description;

    await club.save();

    const updatedClub = await models.Club.findById(clubId)
        .populate("advisor", "name email")
        .populate("leader", "name email enrollmentNo")
        .populate("members", "name email enrollmentNo");

    return returnResponse(res, 200, "Club updated successfully", {
        success: true,
        data: updatedClub
    });
});

// Get club requests
const getClubRequests = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId)
        .populate("pendingMembers", "name email enrollmentNo");

    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (club.leader.toString() !== studentId && club.advisor.toString() !== studentId) {
        return returnResponse(res, 403, "Only leader or advisor can view requests", { success: false, data: null });
    }

    return returnResponse(res, 200, "Requests fetched successfully", {
        success: true,
        data: club.pendingMembers
    });
});

// Approve member
const approveMember = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId, userId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);
    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (club.leader.toString() !== studentId && club.advisor.toString() !== studentId) {
        return returnResponse(res, 403, "Only leader or advisor can approve members", { success: false, data: null });
    }

    if (!club.pendingMembers.includes(userId as any)) {
        return returnResponse(res, 400, "Request not found", { success: false, data: null });
    }

    club.pendingMembers = club.pendingMembers.filter(id => id.toString() !== userId);
    club.members.push(userId as any);
    await club.save();

    return returnResponse(res, 200, "Member approved", { success: true, data: null });
});

// Reject member
const rejectMember = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId, userId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const club = await models.Club.findById(clubId);
    if (!club) {
        return returnResponse(res, 404, "Club not found", { success: false, data: null });
    }

    if (club.leader.toString() !== studentId && club.advisor.toString() !== studentId) {
        return returnResponse(res, 403, "Only leader or advisor can reject members", { success: false, data: null });
    }

    club.pendingMembers = club.pendingMembers.filter(id => id.toString() !== userId);
    await club.save();

    return returnResponse(res, 200, "Member rejected", { success: true, data: null });
});

// Create event for club
const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { clubId } = req.params;
    const { title, description, date, venue } = req.body;

    if (!studentId) return returnResponse(res, 401, "Unauthorized", { success: false, data: null });

    const club = await models.Club.findById(clubId);
    if (!club) return returnResponse(res, 404, "Club not found", { success: false, data: null });

    if (club.leader.toString() !== studentId && club.advisor.toString() !== studentId) {
        return returnResponse(res, 403, "Only leader or advisor can create events", { success: false, data: null });
    }

    const event = await models.Event.create({
        title,
        description,
        date: date || new Date(),
        location: venue, // Assuming location field based on standard event models
        organizer: clubId,
        createdBy: studentId
    });

    club.events.push(event._id as any);
    await club.save();

    return returnResponse(res, 201, "Event created successfully", { success: true, data: event });
});

export {
    createClub,
    getAllClubs,
    getClub,
    joinClub,
    leaveClub,
    addAnnouncement,
    addToGallery,
    updateClub,
    getClubRequests,
    approveMember,
    rejectMember,
    createEvent
};
