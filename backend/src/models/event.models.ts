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
            required: true,
        },
        type: {
            type: String,
            enum: ["internship", "workshop", "hackathon", "seminar", "competition"],
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true,
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
