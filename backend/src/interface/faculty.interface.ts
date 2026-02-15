import type { Document, Types } from "mongoose";


interface IFaculty extends Document{
    name:string;
    email:string;
    password:string;
    myclass:Types.ObjectId;
    role:string;
    generateAccessToken():string;
    isPasswordCorrect(password:string):Promise<boolean>
}

export type { IFaculty }