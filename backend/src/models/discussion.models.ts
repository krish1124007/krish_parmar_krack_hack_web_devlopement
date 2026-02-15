import mongoose, { Schema } from "mongoose";
import type { Document, Types } from "mongoose";

interface IDiscussion extends Document {
    message: string;
    class: Types.ObjectId;
    author: Types.ObjectId;
    authorType: 'Student' | 'Faculty';
    replies: Types.ObjectId[];
}

interface IReply extends Document {
    message: string;
    discussion: Types.ObjectId;
    author: Types.ObjectId;
    authorType: 'Student' | 'Faculty';
}

const replySchema = new Schema<IReply>({
    message: {
        type: String,
        required: true
    },
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'authorType'
    },
    authorType: {
        type: String,
        required: true,
        enum: ['Student', 'Faculty']
    }
}, { timestamps: true });

const discussionSchema = new Schema<IDiscussion>({
    message: {
        type: String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'authorType'
    },
    authorType: {
        type: String,
        required: true,
        enum: ['Student', 'Faculty']
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }]
}, { timestamps: true });

export const Discussion = mongoose.model<IDiscussion>("Discussion", discussionSchema);
export const Reply = mongoose.model<IReply>("Reply", replySchema);
export type { IDiscussion, IReply };
