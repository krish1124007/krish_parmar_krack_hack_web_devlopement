import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
});

export const uploadFromBuffer = async (buffer: Buffer, mimetype: string, folder = "krackhack") => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary credentials are not set in environment variables');
    }



    const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;
    try {
        const res = await cloudinary.uploader.upload(dataUri, { folder, resource_type: 'auto' });
        return res;
    } catch (err: any) {
        console.error('Cloudinary upload error:', err && err.message ? err.message : err);
        throw err;
    }
}

export default cloudinary;
