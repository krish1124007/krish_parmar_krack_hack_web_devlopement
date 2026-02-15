import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Create emergency SOS alert
const createEmergencySOS = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { location, emergencyType, description } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!emergencyType || !description) {
        return returnResponse(res, 400, "Emergency type and description are required", { success: false, data: null });
    }

    const emergencyAlert = await models.EmergencySOS.create({
        student: studentId,
        location,
        emergencyType,
        description,
        status: "reported",
        reportedAt: new Date(),
        responders: []
    });

    const populatedAlert = await models.EmergencySOS.findById(emergencyAlert._id)
        .populate("student", "name email enrollmentNo");

    // TODO: Send notification to campus security/emergency responders

    return returnResponse(res, 201, "Emergency alert created", {
        success: true,
        data: populatedAlert
    });
});

// Get all emergency alerts (admin only)
const getAllEmergencyAlerts = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const alerts = await models.EmergencySOS.find(filter)
        .populate("student", "name email enrollmentNo")
        .sort({ reportedAt: -1 });

    return returnResponse(res, 200, "Alerts fetched successfully", {
        success: true,
        data: alerts
    });
});

// Get user's emergency alerts
const getMyEmergencyAlerts = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const alerts = await models.EmergencySOS.find({ student: studentId })
        .sort({ reportedAt: -1 });

    return returnResponse(res, 200, "Alerts fetched successfully", {
        success: true,
        data: alerts
    });
});

// Get single emergency alert
const getEmergencyAlert = asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;

    const alert = await models.EmergencySOS.findById(alertId)
        .populate("student", "name email enrollmentNo");

    if (!alert) {
        return returnResponse(res, 404, "Alert not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Alert fetched successfully", {
        success: true,
        data: alert
    });
});

// Update emergency alert status (admin/responder)
const updateEmergencyStatus = asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;
    const { status, responderContact } = req.body;

    const alert = await models.EmergencySOS.findById(alertId);

    if (!alert) {
        return returnResponse(res, 404, "Alert not found", { success: false, data: null });
    }

    if (status) {
        alert.status = status;
    }

    if (status === "responded" && responderContact) {
        alert.responders?.push({
            respondedAt: new Date(),
            responderContact
        });
    }

    if (status === "resolved") {
        alert.resolvedAt = new Date();
    }

    await alert.save();

    return returnResponse(res, 200, "Alert updated successfully", {
        success: true,
        data: alert
    });
});

// Cancel emergency alert
const cancelEmergencyAlert = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { alertId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const alert = await models.EmergencySOS.findById(alertId);

    if (!alert) {
        return returnResponse(res, 404, "Alert not found", { success: false, data: null });
    }

    if (alert.student.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    alert.status = "cancelled";
    await alert.save();

    return returnResponse(res, 200, "Alert cancelled", {
        success: true,
        data: alert
    });
});

export {
    createEmergencySOS,
    getAllEmergencyAlerts,
    getMyEmergencyAlerts,
    getEmergencyAlert,
    updateEmergencyStatus,
    cancelEmergencyAlert
};
