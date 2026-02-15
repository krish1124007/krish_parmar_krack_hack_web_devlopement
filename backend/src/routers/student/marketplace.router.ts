import { Router } from "express";
import { verifyJWT, verifyRole } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
    createMarketplaceItem,
    getAllMarketplaceItems,
    getMyMarketplaceItems,
    markItemAsSold,
    updateMarketplaceItem,
    deleteMarketplaceItem
} from "../../controllers/student/marketplace.controller.js";

const router = Router();

// Protected routes - users must be authenticated
router.use(verifyJWT);

// Marketplace routes
router.route("/").post(upload.single("image"), createMarketplaceItem);
router.route("/").get(getAllMarketplaceItems);
router.route("/my-items").get(getMyMarketplaceItems);
router.route("/:itemId/sold").put(markItemAsSold);
router.route("/:itemId").put(upload.single("image"), updateMarketplaceItem);
router.route("/:itemId").delete(deleteMarketplaceItem);

export default router;
