import type { Document } from "mongoose";

export interface ILostFound extends Document {
    title: string;
    description: string;
    category: "lost" | "found" | "forgot";
    itemType: string;
    image?: string;
    location: string;
    dateReported: Date;
    student: string;
    contact: {
        phone: string;
        email: string;
    };
    status: "open" | "claimed" | "resolved";
    claimedBy?: string;
    claimDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
