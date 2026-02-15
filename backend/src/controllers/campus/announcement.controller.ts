import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Create announcement (admin/authority only)
const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { title, content, category, priority, sendEmail, sendPush } = req.body;

    if (!userId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!title || !content || !category) {
        return returnResponse(res, 400, "Title, content, and category are required", { success: false, data: null });
    }

    const imageUrl = (req as any).file?.path || null;

    const announcement = await models.CampusAnnouncement.create({
        title,
        content,
        category,
        author: userId,
        image: imageUrl,
        priority: priority || "medium",
        sendEmail: sendEmail || false,
        sendPush: sendPush || false,
        publishedAt: new Date()
    });

    const populatedAnnouncement = await models.CampusAnnouncement.findById(announcement._id)
        .populate("author", "name email");

    // TODO: Send email and push notifications if enabled

    return returnResponse(res, 201, "Announcement created successfully", {
        success: true,
        data: populatedAnnouncement
    });
});

// Get all announcements
const getAllAnnouncements = asyncHandler(async (req: Request, res: Response) => {
    const { category, priority, search } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ];
    }

    // Filter out expired announcements
    const now = new Date();
    filter.$or = filter.$or || [];
    filter.$or.push({ expiresAt: { $gte: now } }, { expiresAt: null });

    const announcements = await models.CampusAnnouncement.find(filter)
        .populate("author", "name email")
        .sort({ publishedAt: -1 });

    return returnResponse(res, 200, "Announcements fetched successfully", {
        success: true,
        data: announcements
    });
});

// Get single announcement
const getAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const { announcementId } = req.params;

    const announcement = await models.CampusAnnouncement.findById(announcementId)
        .populate("author", "name email");

    if (!announcement) {
        return returnResponse(res, 404, "Announcement not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Announcement fetched successfully", {
        success: true,
        data: announcement
    });
});

// Get announcements by category
const getAnnouncementsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = req.params.category as string;

    if (!category || !["Academic", "Events", "Administrative", "Emergency"].includes(category)) {
        return returnResponse(res, 400, "Invalid category", { success: false, data: null });
    }

    const announcements = await models.CampusAnnouncement.find({ category: category as any })
        .populate("author", "name email")
        .sort({ publishedAt: -1 });

    return returnResponse(res, 200, "Announcements fetched successfully", {
        success: true,
        data: announcements
    });
});

// Update announcement (creator only)
const updateAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const announcementId = req.params.announcementId as string;
    const { title, content, category, priority, expiresAt } = req.body;

    if (!userId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const announcement = await models.CampusAnnouncement.findById(announcementId);

    if (!announcement) {
        return returnResponse(res, 404, "Announcement not found", { success: false, data: null });
    }

    if (announcement.author.toString() !== userId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (category) announcement.category = category;
    if (priority) announcement.priority = priority;
    if (expiresAt) announcement.expiresAt = expiresAt;

    await announcement.save();

    const updatedAnnouncement = await models.CampusAnnouncement.findById(announcementId)
        .populate("author", "name email");

    return returnResponse(res, 200, "Announcement updated successfully", {
        success: true,
        data: updatedAnnouncement
    });
});

// Delete announcement (creator only)
const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const { announcementId } = req.params;

    if (!userId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const announcement = await models.CampusAnnouncement.findById(announcementId);

    if (!announcement) {
        return returnResponse(res, 404, "Announcement not found", { success: false, data: null });
    }

    if (announcement.author.toString() !== userId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    await models.CampusAnnouncement.deleteOne({ _id: announcementId as any });

    return returnResponse(res, 200, "Announcement deleted successfully", {
        success: true,
        data: null
    });
});

// Search announcements
const searchAnnouncements = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query) {
        return returnResponse(res, 400, "Search query is required", { success: false, data: null });
    }

    const announcements = await models.CampusAnnouncement.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } }
        ]
    })
        .populate("author", "name email")
        .sort({ publishedAt: -1 });

    return returnResponse(res, 200, "Announcements found", {
        success: true,
        data: announcements
    });
});

export {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncement,
    getAnnouncementsByCategory,
    updateAnnouncement,
    deleteAnnouncement,
    searchAnnouncements
};
