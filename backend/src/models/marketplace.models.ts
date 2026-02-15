import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IMarketplace extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    image?: string;
    condition: "like-new" | "good" | "fair" | "needs-repair";
    seller: mongoose.Schema.Types.ObjectId;
    buyer?: mongoose.Schema.Types.ObjectId;
    status: "available" | "sold" | "removed";
    contact: {
        phone: string;
        email: string;
    };
    saleDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type marketplaceType = IMarketplace & Document;

const marketplaceSchema = new mongoose.Schema<marketplaceType>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
        condition: {
            type: String,
            enum: ["like-new", "good", "fair", "needs-repair"],
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            default: null,
        },
        status: {
            type: String,
            enum: ["available", "sold", "removed"],
            default: "available",
        },
        contact: {
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
        },
        saleDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const Marketplace = mongoose.model<marketplaceType>("Marketplace", marketplaceSchema);
