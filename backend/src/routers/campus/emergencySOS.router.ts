import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
    createEmergencySOS,
    getAllEmergencyAlerts,
    getMyEmergencyAlerts,
    getEmergencyAlert,
    updateEmergencyStatus,
    cancelEmergencyAlert
} from "../../controllers/campus/emergencySOS.controller.js";

const router = Router();

// Public route to create emergency alert
router.route("/").post(verifyJWT, createEmergencySOS);

// Protected routes
router.use(verifyJWT);

router.route("/").get(getAllEmergencyAlerts);
router.route("/my-alerts").get(getMyEmergencyAlerts);
router.route("/:alertId").get(getEmergencyAlert);
router.route("/:alertId/status").put(updateEmergencyStatus);
router.route("/:alertId/cancel").put(cancelEmergencyAlert);

export default router;
