import { Router } from "express";
import { verifyJWT, verifyRole } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
    createLostFoundItem,
    getAllLostFoundItems,
    getMyLostFoundItems,
    claimLostFoundItem,
    updateLostFoundItem,
    deleteLostFoundItem
} from "../../controllers/student/lostFound.controller.js";

const router = Router();

// Protected routes - users must be authenticated
router.use(verifyJWT);

// Lost & Found routes
router.route("/").post(upload.single("image"), createLostFoundItem);
router.route("/").get(getAllLostFoundItems);
router.route("/my-items").get(getMyLostFoundItems);
router.route("/:itemId/claim").put(claimLostFoundItem);
router.route("/:itemId").put(upload.single("image"), updateLostFoundItem);
router.route("/:itemId").delete(deleteLostFoundItem);

export default router;
