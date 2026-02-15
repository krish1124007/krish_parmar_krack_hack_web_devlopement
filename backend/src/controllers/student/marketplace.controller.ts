import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Create marketplace item
const createMarketplaceItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { title, description, category, price, condition, contact } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!title || !description || !category || price === undefined || !condition) {
        return returnResponse(res, 400, "All fields are required", { success: false, data: null });
    }

    const imageUrl = (req as any).file?.path || null;

    const item = await models.Marketplace.create({
        title,
        description,
        category,
        price,
        condition,
        image: imageUrl,
        seller: studentId,
        contact,
    });

    return returnResponse(res, 201, "Item listed successfully", {
        success: true,
        data: item
    });
});

// Get all marketplace items
const getAllMarketplaceItems = asyncHandler(async (req: Request, res: Response) => {
    const { category, condition, status, priceMin, priceMax } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (status) filter.status = status;
    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const items = await models.Marketplace.find(filter)
        .populate("seller", "name email enrollmentNo")
        .populate("buyer", "name email enrollmentNo")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Items fetched successfully", {
        success: true,
        data: items
    });
});

// Get user's marketplace items
const getMyMarketplaceItems = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const items = await models.Marketplace.find({ seller: studentId })
        .populate("buyer", "name email");

    return returnResponse(res, 200, "Items fetched successfully", {
        success: true,
        data: items
    });
});

// Mark item as sold
const markItemAsSold = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { itemId } = req.params;
    const { buyerId } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.Marketplace.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.seller.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    item.status = "sold";
    item.buyer = buyerId;
    item.saleDate = new Date();

    await item.save();

    return returnResponse(res, 200, "Item marked as sold", {
        success: true,
        data: item
    });
});

// Update marketplace item
const updateMarketplaceItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { itemId } = req.params;
    const { title, description, price, condition } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.Marketplace.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.seller.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (price !== undefined) item.price = price;
    if (condition) item.condition = condition;

    await item.save();

    return returnResponse(res, 200, "Item updated successfully", {
        success: true,
        data: item
    });
});

// Delete marketplace item
const deleteMarketplaceItem = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const itemId = req.params.itemId as string;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const item = await models.Marketplace.findById(itemId);

    if (!item) {
        return returnResponse(res, 404, "Item not found", { success: false, data: null });
    }

    if (item.seller.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    await models.Marketplace.deleteOne({ _id: itemId as any });

    return returnResponse(res, 200, "Item deleted successfully", {
        success: true,
        data: null
    });
});

export {
    createMarketplaceItem,
    getAllMarketplaceItems,
    getMyMarketplaceItems,
    markItemAsSold,
    updateMarketplaceItem,
    deleteMarketplaceItem
};
