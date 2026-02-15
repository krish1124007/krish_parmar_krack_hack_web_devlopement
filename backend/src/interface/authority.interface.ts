import type { Document, Types } from "mongoose";


interface IAuthority extends Document{
    name:string;
    email:string;
    password:string;
    department:string;
    domain: Types.ObjectId; // Reference to AuthorityDomain
    role:string;
    generateAccessToken():string;
    isPasswordCorrect(password:string):Promise<boolean>
}

interface IAuthorityDomain extends Document {
    name: string;
    description?: string;
    authorities: Types.ObjectId[]; // Reference to Authority who created it
    createdAt: Date;
    updatedAt: Date;
}

export type { IAuthority, IAuthorityDomain }