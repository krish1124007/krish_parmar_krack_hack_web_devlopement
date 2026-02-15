import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface IPastPaper extends Document {
    title: string;
    year?: number;
    semester?: string;
    driveLink: string;
    class: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    uploaderType: 'Student' | 'Faculty';
}

const pastPaperSchema = new Schema<IPastPaper>({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number
    },
    semester: {
        type: String
    },
    driveLink: {
        type: String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'uploaderType'
    },
    uploaderType: {
        type: String,
        required: true,
        enum: ['Student', 'Faculty']
    }
}, { timestamps: true });

export const PastPaper = mongoose.model<IPastPaper>("PastPaper", pastPaperSchema);
export type { IPastPaper };
