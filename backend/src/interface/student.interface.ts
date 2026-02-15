import type { Document, Types } from "mongoose";


interface IStudent extends Document {
    name: string;
    email: string;
    enrollmentNo?: string;
    password: string;
    myclass: Types.ObjectId;
    domain?: Types.ObjectId; // Reference to AuthorityDomain if student selected complaint domain
    role: string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>
}

export type { IStudent }