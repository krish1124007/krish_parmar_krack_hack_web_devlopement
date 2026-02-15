import { Router } from "express";
import { login } from "../controllers/student/student.auth.controller.js";
import { getStudentProfile, updateStudentProfile, getAvailableClasses, enrollInClass, getDomains } from "../controllers/student/student.controller.js";
import { getClassDetails, addNote, addPastPaper, addDiscussion, addReply } from "../controllers/student/student.class.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(login);

// Profile routes
router.use(verifyJWT, verifyRole(["student", "Student"]));

router.route("/profile").get(getStudentProfile);
router.route("/get-domains").get(getDomains);
router.route("/profile").put(updateStudentProfile);

// Class routes
router.route("/explore-classes").get(getAvailableClasses);
router.route("/enroll-class").post(enrollInClass);

// Class details routes
router.route("/class/:classId").get(getClassDetails);
router.route("/class/:classId/note").post(addNote);
router.route("/class/:classId/past-paper").post(addPastPaper);
router.route("/class/:classId/discussion").post(addDiscussion);
router.route("/discussion/:discussionId/reply").post(addReply);

export default router;
