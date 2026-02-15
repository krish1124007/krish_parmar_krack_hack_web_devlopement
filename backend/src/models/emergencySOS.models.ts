import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IEmergencySOS extends Document {
    student: mongoose.Schema.Types.ObjectId;
    location?: {
        latitude: number;
        longitude: number;
        address: string;
    };
    emergencyType: string;
    description: string;
    status: "reported" | "responded" | "resolved" | "cancelled";
    responders?: {
        respondedAt: Date;
        responderContact: string;
    }[];
    reportedAt: Date;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type emergencySOSType = IEmergencySOS & Document;

const responderSchema = new mongoose.Schema({
    respondedAt: {
        type: Date,
        required: true,
    },
    responderContact: {
        type: String,
        required: true,
    },
});

const emergencySOSSchema = new mongoose.Schema<emergencySOSType>(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        location: {
            latitude: Number,
            longitude: Number,
            address: String,
        },
        emergencyType: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["reported", "responded", "resolved", "cancelled"],
            default: "reported",
        },
        responders: [responderSchema],
        reportedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const EmergencySOS = mongoose.model<emergencySOSType>("EmergencySOS", emergencySOSSchema);
