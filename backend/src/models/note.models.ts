import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface INote extends Document {
    title: string;
    description?: string;
    driveLink: string;
    class: Types.ObjectId;
    uploadedBy: Types.ObjectId; // student or faculty
    uploaderType: 'Student' | 'Faculty';
}

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true
    },
    description: {
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

export const Note = mongoose.model<INote>("Note", noteSchema);
export type { INote };
