import { Router } from "express";
import { loginFaculty } from "../controllers/faculty/faculty.controller.auth.js";
import { getFacultyClasses } from "../controllers/faculty/faculty.controller.js";
import { getClassDetails, addLecture, markAttendance, addGrade, bulkAddGrades, addNote, addDiscussion, addReply } from "../controllers/faculty/faculty.class.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginFaculty);

// Protected routes
router.use(verifyJWT, verifyRole(["faculty", "Faculty"]));

router.route("/my-classes").get(getFacultyClasses);

// Class details and management routes
router.route("/class/:classId").get(getClassDetails);
router.route("/class/:classId/lecture").post(addLecture);
router.route("/class/:classId/attendance").post(markAttendance);
router.route("/class/:classId/grade").post(addGrade);
router.route("/class/:classId/grades/bulk").post(bulkAddGrades);
router.route("/class/:classId/note").post(addNote);
router.route("/class/:classId/discussion").post(addDiscussion);
router.route("/discussion/:discussionId/reply").post(addReply);

export default router;
