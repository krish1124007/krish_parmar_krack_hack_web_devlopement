import type { Document, Types } from "mongoose";

interface IEvent extends Document {
    title: string;
    description: string;
    image: string;
    type: "internship" | "workshop" | "hackathon" | "seminar" | "competition";
    domain: string;
    faculty: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    location: string;
    maxParticipants?: number;
    registeredStudents?: Types.ObjectId[];
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}

export type { IEvent }