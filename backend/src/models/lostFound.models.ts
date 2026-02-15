import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ILostFound extends Document {
    title: string;
    description: string;
    category: "lost" | "found" | "forgot";
    itemType: string;
    image?: string;
    location: string;
    dateReported: Date;
    student: mongoose.Schema.Types.ObjectId;
    contact: {
        phone: string;
        email: string;
    };
    status: "open" | "claimed" | "resolved";
    claimedBy?: mongoose.Schema.Types.ObjectId;
    claimDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type lostFoundType = ILostFound & Document;

const lostFoundSchema = new mongoose.Schema<lostFoundType>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["lost", "found", "forgot"],
            required: true,
        },
        itemType: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        location: {
            type: String,
            required: true,
        },
        dateReported: {
            type: Date,
            required: true,
            default: Date.now,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        contact: {
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ["open", "claimed", "resolved"],
            default: "open",
        },
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            default: null,
        },
        claimDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const LostFound = mongoose.model<lostFoundType>("LostFound", lostFoundSchema);
