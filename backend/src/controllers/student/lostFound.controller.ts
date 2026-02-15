import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";
///import upload from "../../middlewares/multer.middleware.js";

// Create lost/found item
const createLostFoundItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { title, description, category, itemType, location, contact } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!title || !description || !category || !itemType || !location) {
        return returnResponse(res, 400, "All fields are required", { success: false, data: null });
    }

    const imageUrl = (req as any).file?.path || null;

    const lostFoundItem = await models.LostFound.create({
        title,
        description,
        category,
        itemType,
        location,
        image: imageUrl,
        student: studentId,
        contact,
        dateReported: new Date(),
    });

    return returnResponse(res, 201, "Item posted successfully", {
        success: true,
        data: lostFoundItem
    });
});

// Get all lost/found items
const getAllLostFoundItems = asyncHandler(async (req: Request, res: Response) => {
    const { category, status } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await models.LostFound.find(filter)
        .populate("student", "name email enrollmentNo")
        .populate("claimedBy", "name email enrollmentNo")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Items fetched successfully", {
        success: true,
        data: items
    });
});

// Get user's lost/found items
const getMyLostFoundItems = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const items = await models.LostFound.find({ student: studentId })
        .populate("claimedBy", "name email");

    return returnResponse(res, 200, "Items fetched successfully", {
        success: true,
        data: items
    });
});

// Claim an item
const claimLostFoundItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { itemId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.LostFound.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.status !== "open") {
        return returnResponse(res, 400, "Item is not available for claiming", { success: false, data: null });
    }

    item.status = "claimed";
    item.claimedBy = studentId;
    item.claimDate = new Date();

    await item.save();

    return returnResponse(res, 200, "Item claimed successfully", {
        success: true,
        data: item
    });
});

// Update lost/found item
const updateLostFoundItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { itemId } = req.params;
    const { title, description, location, status } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.LostFound.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.student.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (location) item.location = location;
    if (status) item.status = status;

    await item.save();

    return returnResponse(res, 200, "Item updated successfully", {
        success: true,
        data: item
    });
});

// Delete lost/found item
const deleteLostFoundItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const itemId = req.params.itemId as string;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.LostFound.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.student.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    await models.LostFound.deleteOne({ _id: itemId as any });

    return returnResponse(res, 200, "Item deleted successfully", {
        success: true,
        data: null
    });
});

export {
    createLostFoundItem,
    getAllLostFoundItems,
    getMyLostFoundItems,
    claimLostFoundItem,
    updateLostFoundItem,
    deleteLostFoundItem
};
