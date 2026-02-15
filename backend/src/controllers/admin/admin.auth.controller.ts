import { asyncHandler } from "../../utils/asyncHandler.js";
// import { ApiError } from "../../utils/ApiError.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request  , Response } from "express";

const registerAdmin = asyncHandler(async (req:Request, res:Response) => {
    
    const {email , password , name } = req.body;

    if(!email || !password || !name){
        return returnResponse(res,400,"All fields are required",{success:false , data:null});
    }

    const admin = await models.Admin.create({
        email,
        password,
        name
    })

    if(!admin)
    {
       return returnResponse(res,400,"Admin not created",{success:false , data:null});
    }

    return returnResponse(res,200,"Admin created successfully",{success:true , data:admin});
})

const loginAdmin = asyncHandler(async(req:Request , res:Response) => {
    
    const {email , password} = req.body;

    if(!email || !password){
        return returnResponse(res,400,"All fields are required",{success:false , data:null});
    }

    const admin = await models.Admin.findOne({email});

    if(!admin)
    {
       return returnResponse(res,400,"Admin not found",{success:false , data:null});
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if(!isPasswordCorrect)
    {
       return returnResponse(res,400,"Invalid password",{success:false , data:null});
    }

    const accessToken = admin.generateAccessToken();

    if(!accessToken)
    {
        return returnResponse(res,500,"Access token not generated",{success:false , data:null});
    }

    const options = {
        httpOnly:true,
        secure:true
    }

    return returnResponse(res,200,"Admin logged in successfully",{success:true , data:{admin , accessToken}});
})


export {
    registerAdmin,
    loginAdmin
}