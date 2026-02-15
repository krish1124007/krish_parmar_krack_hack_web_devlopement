import type { Response } from "express";

type datatype = {
        success:boolean;
        data:any;
    }

interface ApiResponseInterface {
    status: number;
    message: string;
    data: datatype;
}

class ApiResponse implements ApiResponseInterface {
    status: number;
    message: string;
    data: datatype;

    constructor(status: number, message: string, data: datatype) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}


function returnResponse(res:Response,statusCode:number,message:string,data:datatype){
    return res.status(statusCode).json(new ApiResponse(statusCode,message,data))
}

export { returnResponse }