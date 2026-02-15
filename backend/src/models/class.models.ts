import mongoose, { Schema } from "mongoose";
import type { IClass } from "../interface/class.interfaces.js";

const classSchema = new Schema<IClass>({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
}, { timestamps: true });

export const Class = mongoose.model<IClass>("Class", classSchema);
