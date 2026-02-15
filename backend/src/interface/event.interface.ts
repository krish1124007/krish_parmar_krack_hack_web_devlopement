import type { Document, Types } from "mongoose";

interface IEvent extends Document {
    title: string;
    description: string;
    image?: string;
    type?: "internship" | "workshop" | "hackathon" | "seminar" | "competition" | "club_event";
    domain?: string;
    faculty?: Types.ObjectId;
    club?: Types.ObjectId;
    organizerType: "faculty" | "club";
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