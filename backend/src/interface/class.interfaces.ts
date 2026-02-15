import type { Document, Types } from "mongoose";


interface IClass extends Document {
    name: string;
    teacher: Types.ObjectId;
    enrolledStudents: Types.ObjectId[];
}

export type { IClass }