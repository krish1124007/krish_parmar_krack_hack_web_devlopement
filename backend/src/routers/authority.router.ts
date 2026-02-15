import { Router } from "express";
import { loginAuthority } from "../controllers/authority/authority.auth.controller.js";
import {
    createDomain,
    getAllDomains,
    getDomainById,
    getMyDomain,
    updateDomain,
    deleteDomain,
    getDomainComplaints,
    acceptComplaint,
    updateComplaintStatus,
    getAssignedComplaints,
    transferComplaint,
    getDomainColleagues,
    getAuthorityStats
} from "../controllers/authority/authority.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Auth routes
router.route("/login").post(loginAuthority);

// Protected Routes (Authority Only)
router.use(verifyJWT, verifyRole(["authority", "Authority"]));

// Stats route
router.route("/stats").get(getAuthorityStats);

// Domain routes
router.route("/domain/create").post(verifyJWT, createDomain);
router.route("/domain/all").get(getAllDomains);
router.route("/domain/my").get(verifyJWT, getMyDomain);
router.route("/domain/:domainId").get(getDomainById);
router.route("/domain/:domainId/update").put(verifyJWT, updateDomain);
router.route("/domain/:domainId/delete").delete(verifyJWT, deleteDomain);

// Complaint routes
router.route("/complaints").get(verifyJWT, getDomainComplaints);
router.route("/complaints/:problemId/accept").post(verifyJWT, acceptComplaint);
router.route("/complaints/:problemId/transfer").post(verifyJWT, transferComplaint);
router.route("/complaints/:problemId/status").put(verifyJWT, updateComplaintStatus);
router.route("/assigned-complaints").get(verifyJWT, getAssignedComplaints);
router.route("/colleagues").get(verifyJWT, getDomainColleagues);

export default router;
