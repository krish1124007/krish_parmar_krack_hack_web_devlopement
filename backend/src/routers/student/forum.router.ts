import { Router } from "express";
import { verifyJWT, verifyRole } from "../../middlewares/auth.middleware.js";
import {
    createForumPost,
    getAllForumPosts,
    getForumPost,
    upvotePost,
    downvotePost,
    addComment,
    flagPost,
    deleteForumPost
} from "../../controllers/student/forum.controller.js";

const router = Router();

// Public routes - no authentication required
router.route("/").get(getAllForumPosts);
router.route("/:postId").get(getForumPost);

// Protected routes - users must be authenticated
router.use(verifyJWT);

router.route("/").post(createForumPost);
router.route("/:postId").delete(deleteForumPost);

// Vote routes
router.route("/:postId/upvote").put(upvotePost);
router.route("/:postId/downvote").put(downvotePost);

// Comment routes
router.route("/:postId/comment").post(addComment);

// Moderation routes
router.route("/:postId/flag").put(flagPost);

export default router;
