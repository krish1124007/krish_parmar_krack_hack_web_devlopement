import type { Document } from "mongoose";

export interface IMarketplace extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    image?: string;
    condition: "like-new" | "good" | "fair" | "needs-repair";
    seller: string;
    buyer?: string;
    status: "available" | "sold" | "removed";
    contact: {
        phone: string;
        email: string;
    };
    saleDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
