import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface ICampusLocation extends Document {
    name: string;
    description: string;
    category: "classroom" | "office" | "lab" | "mess" | "library" | "atm" | "medical" | "other";
    latitude: number;
    longitude: number;
    building?: string;
    floor?: string;
    image?: string;
    facilities?: string[];
    createdAt: Date;
    updatedAt: Date;
}

type campusLocationType = ICampusLocation & Document;

const campusLocationSchema = new mongoose.Schema<campusLocationType>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["classroom", "office", "lab", "mess", "library", "atm", "medical", "other"],
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        building: {
            type: String,
            default: null,
        },
        floor: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        facilities: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export const CampusLocation = mongoose.model<campusLocationType>("CampusLocation", campusLocationSchema);
