import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IClub extends Document {
    name: string;
    description: string;
    logo?: string;
    banner?: string;
    advisor: mongoose.Schema.Types.ObjectId;
    members: mongoose.Schema.Types.ObjectId[];
    pendingMembers: mongoose.Schema.Types.ObjectId[];
    leader: mongoose.Schema.Types.ObjectId;
    events: mongoose.Schema.Types.ObjectId[];
    announcements: {
        title: string;
        content: string;
        date: Date;
    }[];
    gallery: string[];
    createdAt: Date;
    updatedAt: Date;
}

type clubType = IClub & Document;

const clubSchema = new mongoose.Schema<clubType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            default: null,
        },
        banner: {
            type: String,
            default: null,
        },
        advisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        pendingMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        events: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
            },
        ],
        announcements: [
            {
                title: String,
                content: String,
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        gallery: [String],
    },
    { timestamps: true }
);

export const Club = mongoose.model<clubType>("Club", clubSchema);
