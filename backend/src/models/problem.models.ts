import { IProblem } from "../interface/problem.interface.js";
import mongoose from "mongoose";
import type { Document } from "mongoose";



type problem_type = IProblem & Document;

const problemSchema = new mongoose.Schema<problem_type>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthorityDomain",
        required: true
    },
    authority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authority",
        required: false
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authority",
        required: false
    },
    status: {
        type: String,
        enum: ["new", "progress", "resolved"],
        default: "new"
    },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium"
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    comments: [{
        text: { type: String, required: true },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "Authority", required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Problem = mongoose.model<problem_type>("Problem", problemSchema);

export default Problem;