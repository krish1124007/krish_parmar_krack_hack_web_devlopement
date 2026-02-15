import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
    createClub,
    getAllClubs,
    getClub,
    joinClub,
    leaveClub,
    addAnnouncement,
    addToGallery,
    updateClub,
    getClubRequests,
    approveMember,
    rejectMember,
    createEvent
} from "../../controllers/campus/club.controller.js";

const router = Router();

// Public routes - no authentication required
router.route("/").get(getAllClubs);
router.route("/:clubId").get(getClub);

// Protected routes - users must be authenticated
router.use(verifyJWT);

// Admin routes (TODO: add admin verification middleware)
router.route("/").post(upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createClub);

// User routes
router.route("/:clubId/join").post(joinClub);
router.route("/:clubId/leave").post(leaveClub);
router.route("/:clubId").put(updateClub);

// Announcement routes
router.route("/:clubId/announcement").post(addAnnouncement);

// Gallery routes
router.route("/:clubId/gallery").post(upload.single("image"), addToGallery);

// Club Admin routes
router.route("/:clubId/requests").get(getClubRequests);
router.route("/:clubId/approve/:userId").post(approveMember);
router.route("/:clubId/reject/:userId").post(rejectMember);
router.route("/:clubId/event").post(createEvent);

export default router;
