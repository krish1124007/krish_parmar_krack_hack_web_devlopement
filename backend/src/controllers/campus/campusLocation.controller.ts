import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Get all campus locations
const getAllCampusLocations = asyncHandler(async (req: Request, res: Response) => {
    const { category, search } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const locations = await models.CampusLocation.find(filter);

    return returnResponse(res, 200, "Locations fetched successfully", {
        success: true,
        data: locations
    });
});

// Get single campus location
const getCampusLocation = asyncHandler(async (req: Request, res: Response) => {
    const { locationId } = req.params;

    const location = await models.CampusLocation.findById(locationId);

    if (!location) {
        return returnResponse(res, 404, "Location not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Location fetched successfully", {
        success: true,
        data: location
    });
});

// Create campus location (admin only)
const createCampusLocation = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, category, latitude, longitude, building, floor, facilities } = req.body;

    if (!name || !description || !category || latitude === undefined || longitude === undefined) {
        return returnResponse(res, 400, "Required fields missing", { success: false, data: null });
    }

    const imageUrl = (req as any).file?.path || null;

    const location = await models.CampusLocation.create({
        name,
        description,
        category,
        latitude,
        longitude,
        building,
        floor,
        image: imageUrl,
        facilities: facilities || []
    });

    return returnResponse(res, 201, "Location created successfully", {
        success: true,
        data: location
    });
});

// Update campus location (admin only)
const updateCampusLocation = asyncHandler(async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const { name, description, category, latitude, longitude, building, floor, facilities } = req.body;

    const location = await models.CampusLocation.findById(locationId);

    if (!location) {
        return returnResponse(res, 404, "Location not found", { success: false, data: null });
    }

    if (name) location.name = name;
    if (description) location.description = description;
    if (category) location.category = category;
    if (latitude !== undefined) location.latitude = latitude;
    if (longitude !== undefined) location.longitude = longitude;
    if (building) location.building = building;
    if (floor) location.floor = floor;
    if (facilities) location.facilities = facilities;

    await location.save();

    return returnResponse(res, 200, "Location updated successfully", {
        success: true,
        data: location
    });
});

// Delete campus location (admin only)
const deleteCampusLocation = asyncHandler(async (req: Request, res: Response) => {
    const locationId = req.params.locationId as string;

    const location = await models.CampusLocation.findById(locationId);

    if (!location) {
        return returnResponse(res, 404, "Location not found", { success: false, data: null });
    }

    await models.CampusLocation.deleteOne({ _id: locationId as any });

    return returnResponse(res, 200, "Location deleted successfully", {
        success: true,
        data: null
    });
});

// Search locations by name
const searchLocations = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query) {
        return returnResponse(res, 400, "Search query is required", { success: false, data: null });
    }

    const locations = await models.CampusLocation.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    });

    return returnResponse(res, 200, "Locations found", {
        success: true,
        data: locations
    });
});

export {
    getAllCampusLocations,
    getCampusLocation,
    createCampusLocation,
    updateCampusLocation,
    deleteCampusLocation,
    searchLocations
};
