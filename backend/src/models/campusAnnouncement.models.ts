import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ICampusAnnouncement extends Document {
    title: string;
    content: string;
    category: "Academic" | "Events" | "Administrative" | "Emergency";
    author: mongoose.Schema.Types.ObjectId;
    image?: string;
    priority: "low" | "medium" | "high" | "urgent";
    sendEmail: boolean;
    sendPush: boolean;
    publishedAt: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type campusAnnouncementType = ICampusAnnouncement & Document;

const campusAnnouncementSchema = new mongoose.Schema<campusAnnouncementType>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Academic", "Events", "Administrative", "Emergency"],
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Authority",
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        sendEmail: {
            type: Boolean,
            default: false,
        },
        sendPush: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const CampusAnnouncement = mongoose.model<campusAnnouncementType>(
    "CampusAnnouncement",
    campusAnnouncementSchema
);
