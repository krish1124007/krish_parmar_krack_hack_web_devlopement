import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IForumComment extends Document {
    author: mongoose.Schema.Types.ObjectId;
    content: string;
    upvotes: mongoose.Schema.Types.ObjectId[];
    downvotes: mongoose.Schema.Types.ObjectId[];
    flagged: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IForumPost extends Document {
    title: string;
    content: string;
    category: "Academics" | "Campus Life" | "Events" | "Tech Support" | "General";
    author: mongoose.Schema.Types.ObjectId;
    upvotes: mongoose.Schema.Types.ObjectId[];
    downvotes: mongoose.Schema.Types.ObjectId[];
    comments: IForumComment[];
    flagged: boolean;
    flagReasons?: string[];
    createdAt: Date;
    updatedAt: Date;
}

type forumPostType = IForumPost & Document;

const forumCommentSchema = new mongoose.Schema<IForumComment>(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        downvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        flagged: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const forumPostSchema = new mongoose.Schema<forumPostType>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Academics", "Campus Life", "Events", "Tech Support", "General"],
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        downvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        comments: [forumCommentSchema],
        flagged: {
            type: Boolean,
            default: false,
        },
        flagReasons: [
            {
                type: String,
                default: [],
            },
        ],
    },
    { timestamps: true }
);

export const ForumPost = mongoose.model<forumPostType>("ForumPost", forumPostSchema);
