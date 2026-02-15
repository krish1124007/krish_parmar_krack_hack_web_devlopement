import mongoose from "mongoose";
import type { IStudent } from "../interface/student.interface.js";
import type { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


type userType = IStudent & Document;


const studentSchema = new mongoose.Schema<userType>({
    name: {
        type: String,
        required: false,
        unique: false,
    },
    enrollmentNo: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    myclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthorityDomain",
        required: false
    },
    role: {
        type: String,
        default: "Student"
    }
}, { timestamps: true })


studentSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

studentSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    }, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    })
}

studentSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}


export const Student = mongoose.model("Student", studentSchema);


