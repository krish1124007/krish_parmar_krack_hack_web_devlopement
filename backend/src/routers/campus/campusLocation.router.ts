import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import {
    getAllCampusLocations,
    getCampusLocation,
    createCampusLocation,
    updateCampusLocation,
    deleteCampusLocation,
    searchLocations
} from "../../controllers/campus/campusLocation.controller.js";

const router = Router();

// Public routes - no authentication required
router.route("/").get(getAllCampusLocations);
router.route("/:locationId").get(getCampusLocation);
router.route("/search").get(searchLocations);

// Admin-only routes (TODO: add admin verification middleware)
router.route("/").post(upload.single("image"), createCampusLocation);
router.route("/:locationId").put(upload.single("image"), updateCampusLocation);
router.route("/:locationId").delete(deleteCampusLocation);

export default router;
