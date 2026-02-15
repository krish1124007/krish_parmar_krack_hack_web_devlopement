import type { Document } from "mongoose";

export interface IEmergencySOS extends Document {
    student: string;
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
