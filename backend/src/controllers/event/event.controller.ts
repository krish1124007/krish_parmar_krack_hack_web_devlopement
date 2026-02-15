import type { Request, Response } from "express";
import Event from "../../models/event.models.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFromBuffer } from "../../utils/cloudinary.js";

interface AuthRequest extends Request {
    user?: any;
}

// Faculty: Create a new event
const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
        title,
        description,
        type,
        domain,
        startDate,
        endDate,
        location,
        maxParticipants,
    } = req.body;
    const facultyId = req.user?._id;

    let image = req.body.image;
    if (req.file) {
        try {
            const file: any = req.file;
            const uploadRes: any = await uploadFromBuffer(
                file.buffer,
                file.mimetype,
                "events"
            );
            image = uploadRes.secure_url;
        } catch (err) {
            console.error("Error uploading event image:", err);
            return returnResponse(res, 500, "Image upload failed", {
                success: false,
                data: null,
            });
        }
    }

    if (!facultyId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (
        !title ||
        !description ||
        !type ||
        !domain ||
        !startDate ||
        !endDate ||
        !location ||
        !image
    ) {
        return returnResponse(
            res,
            400,
            "All fields are required (title, description, type, domain, startDate, endDate, location, image)",
            { success: false, data: null }
        );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
        return returnResponse(res, 400, "End date must be after start date", {
            success: false,
            data: null,
        });
    }

    const event = await Event.create({
        title,
        description,
        image,
        type,
        domain,
        faculty: facultyId,
        startDate: start,
        endDate: end,
        location,
        maxParticipants: maxParticipants || null,
        registeredStudents: [],
        status: "upcoming" // Explicitly set status
    });

    const populatedEvent = await event.populate("faculty", "name email");

    return returnResponse(res, 201, "Event created successfully", {
        success: true,
        data: populatedEvent,
    });
});

// Faculty: Get all events created by the logged-in faculty
const getFacultyEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
    const facultyId = req.user?._id;

    if (!facultyId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const events = await Event.find({ faculty: facultyId })
        .populate("faculty", "name email")
        .populate("registeredStudents", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Faculty events fetched successfully", {
        success: true,
        data: events,
    });
});

// Student: Get all upcoming events or filter by domain
const getStudentEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { domain, type } = req.query;
    // Allow all statuses for now to ensure events are visible
    const filter: any = {};

    // Only filter by status if we want to hide cancelled events
    filter.status = { $ne: "cancelled" };

    if (domain) {
        filter.domain = domain;
    }

    if (type) {
        filter.type = type;
    }

    const events = await Event.find(filter)
        .populate("faculty", "name email")
        .populate("registeredStudents", "name email")
        .sort({ startDate: 1 });

    return returnResponse(res, 200, "Events fetched successfully", {
        success: true,
        data: events,
    });
});

// Student: Register for an event
const registerForEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { eventId } = req.params;
    const studentId = req.user?._id;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const event = await Event.findById(eventId);

    if (!event) {
        return returnResponse(res, 404, "Event not found", { success: false, data: null });
    }

    // Check if already registered
    const isRegistered = event.registeredStudents?.some(
        (id) => id.toString() === studentId
    );

    if (isRegistered) {
        return returnResponse(res, 400, "Already registered for this event", {
            success: false,
            data: null,
        });
    }

    // Check if max participants reached
    if (
        event.maxParticipants &&
        event.registeredStudents &&
        event.registeredStudents.length >= event.maxParticipants
    ) {
        return returnResponse(res, 400, "Event is full", { success: false, data: null });
    }

    event.registeredStudents?.push(studentId);
    await event.save();

    const updatedEvent = await event.populate("faculty", "name email");
    updatedEvent.populate("registeredStudents", "name email");

    return returnResponse(res, 200, "Registered for event successfully", {
        success: true,
        data: updatedEvent,
    });
});

// Student: Unregister from an event
const unregisterFromEvent = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { eventId } = req.params;
        const studentId = req.user?._id;

        if (!studentId) {
            return returnResponse(res, 401, "Unauthorized", {
                success: false,
                data: null,
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return returnResponse(res, 404, "Event not found", {
                success: false,
                data: null,
            });
        }

        event.registeredStudents = (event.registeredStudents || []).filter(
            (id) => id.toString() !== studentId
        );

        await event.save();

        const updatedEvent = await event.populate("faculty", "name email");
        updatedEvent.populate("registeredStudents", "name email");

        return returnResponse(res, 200, "Unregistered from event successfully", {
            success: true,
            data: updatedEvent,
        });
    }
);

// Admin: Get all events
const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await Event.find({})
        .populate("faculty", "name email")
        .populate("registeredStudents", "name email")
        .sort({ startDate: 1 });

    return returnResponse(res, 200, "All events fetched successfully", {
        success: true,
        data: events,
    });
});

// Faculty/Admin: Update event
const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { eventId } = req.params;
    const { title, description, type, domain, startDate, endDate, location, maxParticipants, status } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
        return returnResponse(res, 404, "Event not found", { success: false, data: null });
    }

    // Update fields if provided
    if (title) event.title = title;
    if (description) event.description = description;
    if (type) event.type = type;
    if (domain) event.domain = domain;
    if (startDate) event.startDate = new Date(startDate);
    if (endDate) event.endDate = new Date(endDate);
    if (location) event.location = location;
    if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
    if (status) event.status = status;

    // Handle image upload if provided
    if (req.file) {
        try {
            const file: any = req.file;
            const uploadRes: any = await uploadFromBuffer(
                file.buffer,
                file.mimetype,
                "events"
            );
            event.image = uploadRes.secure_url;
        } catch (err) {
            console.error("Error uploading event image:", err);
            return returnResponse(res, 500, "Image upload failed", {
                success: false,
                data: null,
            });
        }
    }

    await event.save();

    const updatedEvent = await event.populate("faculty", "name email");
    updatedEvent.populate("registeredStudents", "name email");

    return returnResponse(res, 200, "Event updated successfully", {
        success: true,
        data: updatedEvent,
    });
});

// Faculty/Admin: Delete event
const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
        return returnResponse(res, 404, "Event not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Event deleted successfully", {
        success: true,
        data: deletedEvent,
    });
});

// Get single event details
const getEventDetails = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
        .populate("faculty", "name email")
        .populate("registeredStudents", "name email");

    if (!event) {
        return returnResponse(res, 404, "Event not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Event details fetched successfully", {
        success: true,
        data: event,
    });
});

export {
    createEvent,
    getFacultyEvents,
    getStudentEvents,
    registerForEvent,
    unregisterFromEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getEventDetails,
};
