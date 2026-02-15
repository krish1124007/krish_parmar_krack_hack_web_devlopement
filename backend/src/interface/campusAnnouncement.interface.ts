import type { Document } from "mongoose";

export interface ICampusAnnouncement extends Document {
    title: string;
    content: string;
    category: "Academic" | "Events" | "Administrative" | "Emergency";
    author: string;
    image?: string;
    priority: "low" | "medium" | "high" | "urgent";
    sendEmail: boolean;
    sendPush: boolean;
    publishedAt: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
