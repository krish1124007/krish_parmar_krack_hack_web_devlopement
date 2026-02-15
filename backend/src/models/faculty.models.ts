import mongoose from "mongoose";
import type { IFaculty } from "../interface/faculty.interface.js";
import type { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


type userType = IFaculty & Document;


const fcSchema = new mongoose.Schema<userType>({
    name: {
        type: String,
        required: true,
        uniqe: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniqe: true
    },
    myclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    role: {
        type: String,
        default: "Faculty"
    }
}, { timestamps: true })


fcSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

fcSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    }, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    })
}

fcSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}


export const Faculty = mongoose.model("Faculty", fcSchema);


