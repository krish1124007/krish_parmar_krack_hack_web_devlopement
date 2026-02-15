import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncement,
    getAnnouncementsByCategory,
    updateAnnouncement,
    deleteAnnouncement,
    searchAnnouncements
} from "../../controllers/campus/announcement.controller.js";

const router = Router();

// Public routes - no authentication required
router.route("/").get(getAllAnnouncements);
router.route("/search").get(searchAnnouncements);
router.route("/category/:category").get(getAnnouncementsByCategory);
router.route("/:announcementId").get(getAnnouncement);

// Protected routes - users must be authenticated
router.use(verifyJWT);

// Admin routes (TODO: add admin verification middleware)
router.route("/").post(upload.single("image"), createAnnouncement);
router.route("/:announcementId").put(upload.single("image"), updateAnnouncement);
router.route("/:announcementId").delete(deleteAnnouncement);

export default router;
