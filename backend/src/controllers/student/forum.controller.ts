import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import type { Request, Response } from "express";
import { models } from "../../admin/model.register.js";

// Create forum post
const createForumPost = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { title, content, category } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!title || !content || !category) {
        return returnResponse(res, 400, "Title, content, and category are required", { success: false, data: null });
    }

    const post = await models.ForumPost.create({
        title,
        content,
        category,
        author: studentId,
        comments: [],
        upvotes: [],
        downvotes: [],
        flagged: false,
    });

    const populatedPost = await models.ForumPost.findById(post._id).populate("author", "name email enrollmentNo");

    return returnResponse(res, 201, "Post created successfully", {
        success: true,
        data: populatedPost
    });
});

// Get all forum posts
const getAllForumPosts = asyncHandler(async (req: Request, res: Response) => {
    const { category, search } = req.query;
    const filter: any = { flagged: false };

    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ];
    }

    const posts = await models.ForumPost.find(filter)
        .populate("author", "name email enrollmentNo")
        .populate("comments.author", "name email enrollmentNo")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Posts fetched successfully", {
        success: true,
        data: posts
    });
});

// Get single forum post
const getForumPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const post = await models.ForumPost.findById(postId)
        .populate("author", "name email enrollmentNo")
        .populate("comments.author", "name email enrollmentNo");

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Post fetched successfully", {
        success: true,
        data: post
    });
});

// Upvote post
const upvotePost = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { postId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const post = await models.ForumPost.findById(postId);

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    if (post.upvotes.includes(studentId)) {
        post.upvotes = post.upvotes.filter(id => id.toString() !== studentId);
    } else {
        post.upvotes.push(studentId);
        post.downvotes = post.downvotes.filter(id => id.toString() !== studentId);
    }

    await post.save();

    return returnResponse(res, 200, "Post voted successfully", {
        success: true,
        data: post
    });
});

// Downvote post
const downvotePost = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { postId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const post = await models.ForumPost.findById(postId);

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    if (post.downvotes.includes(studentId)) {
        post.downvotes = post.downvotes.filter(id => id.toString() !== studentId);
    } else {
        post.downvotes.push(studentId);
        post.upvotes = post.upvotes.filter(id => id.toString() !== studentId);
    }

    await post.save();

    return returnResponse(res, 200, "Post voted successfully", {
        success: true,
        data: post
    });
});

// Add comment
const addComment = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!content) {
        return returnResponse(res, 400, "Comment content is required", { success: false, data: null });
    }

    const post = await models.ForumPost.findById(postId);

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    const comment = {
        author: studentId,
        content,
        upvotes: [],
        downvotes: [],
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    post.comments.push(comment as any);
    await post.save();

    const updatedPost = await models.ForumPost.findById(postId)
        .populate("author", "name email enrollmentNo")
        .populate("comments.author", "name email enrollmentNo");

    return returnResponse(res, 201, "Comment added successfully", {
        success: true,
        data: updatedPost
    });
});

// Flag post for moderation
const flagPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return returnResponse(res, 400, "Reason is required", { success: false, data: null });
    }

    const post = await models.ForumPost.findById(postId);

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    post.flagged = true;
    post.flagReasons?.push(reason);

    await post.save();

    return returnResponse(res, 200, "Post flagged",  {
        success: true,
        data: post
    });
});

// Delete forum post (by owner or admin)
const deleteForumPost = asyncHandler(async (req: Request, res: Response) => {
    const studentId = (req as any).user?._id;
    const { postId } = req.params;

    if (!studentId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const post = await models.ForumPost.findById(postId);

    if (!post) {
        return returnResponse(res, 404, "Post not found", { success: false, data: null });
    }

    if (post.author.toString() !== studentId) {
        return returnResponse(res, 403, "Forbidden", { success: false, data: null });
    }

    await models.ForumPost.deleteOne({ _id: postId as any });

    return returnResponse(res, 200, "Post deleted successfully", {
        success: true,
        data: null
    });
});

export {
    createForumPost,
    getAllForumPosts,
    getForumPost,
    upvotePost,
    downvotePost,
    addComment,
    flagPost,
    deleteForumPost
};
