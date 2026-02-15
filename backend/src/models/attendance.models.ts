import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface IAttendance extends Document {
    class: Types.ObjectId;
    date: Date;
    lecture?: Types.ObjectId;
    presentStudents: Types.ObjectId[];
    absentStudents: Types.ObjectId[];
    markedBy: Types.ObjectId; // faculty
}

const attendanceSchema = new Schema<IAttendance>({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    },
    presentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    absentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true
    }
}, { timestamps: true });

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
export type { IAttendance };
