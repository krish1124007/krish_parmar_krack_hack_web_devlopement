import { Router } from "express";
import {
    createProblem,
    getAllProblems,
    getDomainProblems,
    getStudentProblems,
    getProblemsByDomain,
    updateProblemStatus
} from "../controllers/problem/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Student routes
router.route("/create").post(verifyJWT, upload.single("image"), createProblem);
router.route("/student/problems").get(verifyJWT, getStudentProblems);

// Authority routes
router.route("/domain/problems").get(verifyJWT, getDomainProblems);
router.route("/domain/:domainId/problems").get(getProblemsByDomain);
router.route("/update/:problemId").patch(verifyJWT, updateProblemStatus);

// Admin routes
router.route("/all").get(verifyJWT, getAllProblems);

export default router;
