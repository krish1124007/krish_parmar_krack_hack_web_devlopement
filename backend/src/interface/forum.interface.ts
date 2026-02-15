import type { Document } from "mongoose";

export interface IForumComment extends Document {
    author: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    flagged: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IForumPost extends Document {
    title: string;
    content: string;
    category: "Academics" | "Campus Life" | "Events" | "Tech Support" | "General";
    author: string;
    upvotes: string[];
    downvotes: string[];
    comments: IForumComment[];
    flagged: boolean;
    flagReasons?: string[];
    createdAt: Date;
    updatedAt: Date;
}
