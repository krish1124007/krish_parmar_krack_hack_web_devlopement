import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface ILecture extends Document {
    title: string;
    description?: string;
    scheduledDate: Date;
    duration?: number; // in minutes
    class: Types.ObjectId;
    createdBy: Types.ObjectId; // faculty
    status: 'scheduled' | 'completed' | 'cancelled';
}

const lectureSchema = new Schema<ILecture>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        default: 60
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, { timestamps: true });

export const Lecture = mongoose.model<ILecture>("Lecture", lectureSchema);
export type { ILecture };
