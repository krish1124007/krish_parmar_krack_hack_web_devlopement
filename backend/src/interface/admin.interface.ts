import { Document } from "mongoose";


interface IAdmin extends Document{
    name:string;
    email:string;
    password:string;
    role:string;
    generateAccessToken():string;
    isPasswordCorrect(password:string):Promise<boolean>
}

export type { IAdmin }


