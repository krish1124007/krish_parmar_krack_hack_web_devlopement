import mongoose from "mongoose";
import type { IEvent } from "../interface/event.interface.js";
import type { Document } from "mongoose";

type eventType = IEvent & Document;

const eventSchema = new mongoose.Schema<eventType>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ["internship", "workshop", "hackathon", "seminar", "competition", "club_event"],
            required: false,
        },
        domain: {
            type: String,
            required: false,
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: false,
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: false,
        },
        organizerType: {
            type: String,
            enum: ["faculty", "club"],
            required: true,
            default: "faculty",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        maxParticipants: {
            type: Number,
            default: null,
        },
        registeredStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

const Event = mongoose.model<eventType>("Event", eventSchema);

export default Event;
