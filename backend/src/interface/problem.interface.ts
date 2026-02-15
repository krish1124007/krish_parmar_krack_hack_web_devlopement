import mongoose, { Document } from "mongoose";

interface IProblem extends Document {
    title: string;
    description: string;
    image: string;
    department: string;
    domain: mongoose.Types.ObjectId; // Reference to AuthorityDomain
    authority: mongoose.Types.ObjectId; // Reference to Authority
    acceptedBy: mongoose.Types.ObjectId; // Reference to Authority handling this complaint
    status: "new" | "progress" | "resolved";
    priority: "high" | "medium" | "low";
    student: mongoose.Types.ObjectId; // Reference to Student ID
    comments: {
        text: string;
        by: mongoose.Types.ObjectId;
        createdAt: Date;
    }[];
}

export { IProblem };