import type { Document } from "mongoose";

export interface IClub extends Document {
    name: string;
    description: string;
    logo?: string;
    banner?: string;
    advisor: string;
    members: string[];
    leader: string;
    events: string[];
    announcements: {
        title: string;
        content: string;
        date: Date;
    }[];
    gallery: string[];
    createdAt: Date;
    updatedAt: Date;
}
