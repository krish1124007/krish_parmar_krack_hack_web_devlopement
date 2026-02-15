import { Router } from "express";
import {
    createEvent,
    getFacultyEvents,
    getStudentEvents,
    registerForEvent,
    unregisterFromEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getEventDetails,
} from "../controllers/event/event.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Faculty routes
router.route("/create").post(verifyJWT, verifyRole(["faculty", "Faculty"]), upload.single("image"), createEvent);
router.route("/faculty/events").get(verifyJWT, verifyRole(["faculty", "Faculty"]), getFacultyEvents);
router.route("/update/:eventId").patch(verifyJWT, verifyRole(["faculty", "Faculty"]), upload.single("image"), updateEvent);
router.route("/delete/:eventId").delete(verifyJWT, verifyRole(["faculty", "Faculty"]), deleteEvent);

// Student routes
router.route("/student/events").get(verifyJWT, verifyRole(["student", "Student"]), getStudentEvents);
router.route("/register/:eventId").post(verifyJWT, verifyRole(["student", "Student"]), registerForEvent);
router.route("/unregister/:eventId").post(verifyJWT, verifyRole(["student", "Student"]), unregisterFromEvent);

// Admin routes
router.route("/all").get(verifyJWT, verifyRole(["admin", "Admin"]), getAllEvents);

// Public/Common routes (accessible by all authenticated users)
router.route("/:eventId").get(verifyJWT, getEventDetails);

export default router;
