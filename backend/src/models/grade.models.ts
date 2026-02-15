import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface IGrade extends Document {
    student: Types.ObjectId;
    class: Types.ObjectId;
    title: string; // e.g., "Mid-term Exam", "Assignment 1"
    marks: number;
    maxMarks: number;
    type: 'exam' | 'assignment' | 'quiz' | 'project' | 'other';
    date: Date;
    remarks?: string;
    enteredBy: Types.ObjectId; // faculty
}

const gradeSchema = new Schema<IGrade>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['exam', 'assignment', 'quiz', 'project', 'other']
    },
    date: {
        type: Date,
        default: Date.now
    },
    remarks: {
        type: String
    },
    enteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    }
}, { timestamps: true });

export const Grade = mongoose.model<IGrade>("Grade", gradeSchema);
export type { IGrade };
