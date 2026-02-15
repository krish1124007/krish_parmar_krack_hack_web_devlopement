import mongoose from "mongoose";




export async function connectDB()
{
    try {
        const rp = await mongoose.connect(process.env.DB_URL as string);
        console.log("Database connect Successfully");
    } catch (error) {
        console.log("Database not connect properly the error is  : " , error);
    }
}