import type { IAuthority, IAuthorityDomain } from "../interface/authority.interface.js";
import type { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import mongoose from "mongoose";


type userType = IAuthority & Document;
type domainType = IAuthorityDomain & Document;


const authoritySchema = new mongoose.Schema<userType>({
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
    department: {
        type: String,
        required: false
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthorityDomain",
        required: false
    },
    role: {
        type: String,
        default: "Authority"
    }
}, { timestamps: true })

const authorityDomainSchema = new mongoose.Schema<domainType>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },

    authorities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authority",
        required: false
    }]
}, { timestamps: true })


authoritySchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

authoritySchema.methods.generateAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        domain: this.domain,
        role: this.role
    }, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    })
}

authoritySchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}


export const Authority = mongoose.model("Authority", authoritySchema);
export const AuthorityDomain = mongoose.model("AuthorityDomain", authorityDomainSchema);