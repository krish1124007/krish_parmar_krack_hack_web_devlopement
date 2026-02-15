import mongoose, { Schema, Document } from "mongoose";

export interface IAllowStudent extends Document {
    email: string;
    myclass: mongoose.Schema.Types.ObjectId;
}

const allowStudentSchema = new Schema<IAllowStudent>({
    email: {
        type: String,
        required: true,
        // Since different students might join different classes with same email?? 
        // No, typically email is unique per student. But maybe a student can be "allowed" for multiple classes?
        // Let's assume unique per class, or simpler, unique globally if they are not yet registered.
        // For now, allow duplicates unless we enforce uniqueness. But duplicate emails for different classes is safer logic.
    },
    myclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    }
}, { timestamps: true });

export const AllowStudent = mongoose.model<IAllowStudent>("AllowStudent", allowStudentSchema);
