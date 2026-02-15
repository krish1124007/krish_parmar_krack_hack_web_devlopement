import multer from "multer";
import path from "path";

// Configure memory storage for file uploads
const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});
