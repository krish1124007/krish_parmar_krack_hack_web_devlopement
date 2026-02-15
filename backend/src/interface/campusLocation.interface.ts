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
