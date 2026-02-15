import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request, Response } from "express";

// Create a new authority domain
// Create a new authority domain
const createDomain = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const authorityId = (req as any).user?._id;

    if (!name) {
        return returnResponse(res, 400, "Domain name is required", { success: false, data: null });
    }

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    // Check if domain already exists
    const existingDomain = await models.AuthorityDomain.findOne({ name });
    if (existingDomain) {
        return returnResponse(res, 400, "Domain already exists", { success: false, data: null });
    }

    const domain = await models.AuthorityDomain.create({
        name,
        description: description || "",
        authorities: [authorityId]
    });

    // Update authority with this domain
    await models.Authority.findByIdAndUpdate(authorityId, { domain: domain._id });

    return returnResponse(res, 201, "Domain created successfully", {
        success: true,
        data: domain
    });
});

// Get all domains (visible to all authorities and admin)
const getAllDomains = asyncHandler(async (req: Request, res: Response) => {
    const domains = await models.AuthorityDomain.find()
        .populate("authority", "name email") // This line might be wrong as 'authority' field is gone or unused in schema, but leaving as is for backward compat if any schema diff. Schema has 'authorities'.
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Domains fetched successfully", {
        success: true,
        data: domains
    });
});

// Get specific domain by ID
const getDomainById = asyncHandler(async (req: Request, res: Response) => {
    const { domainId } = req.params;

    const domain = await models.AuthorityDomain.findById(domainId)
        .populate("authorities", "name email");

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Domain fetched successfully", {
        success: true,
        data: domain
    });
});

// Get authority's own domain
const getMyDomain = asyncHandler(async (req: Request, res: Response) => {
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const authority = await models.Authority.findById(authorityId).populate("domain");
    const domain = authority?.domain;

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Domain fetched successfully", {
        success: true,
        data: domain
    });
});

// Update domain
const updateDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domainId } = req.params;
    const { name, description } = req.body;
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const domain = await models.AuthorityDomain.findById(domainId);

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    // Check if authority owns this domain (is in authorities array)
    // Assuming the one who created it or is assigned is an admin/owner. Here simplifying to checking if in list.
    if (!domain.authorities.includes(authorityId)) {
        return returnResponse(res, 403, "You can only update your own domain", { success: false, data: null });
    }

    if (name) domain.name = name;
    if (description) domain.description = description;

    await domain.save();

    return returnResponse(res, 200, "Domain updated successfully", {
        success: true,
        data: domain
    });
});

// Delete domain
const deleteDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domainId } = req.params;
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const domain = await models.AuthorityDomain.findById(domainId);

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    if (!domain.authorities.includes(authorityId)) {
        return returnResponse(res, 403, "You can only delete your own domain", { success: false, data: null });
    }

    await models.AuthorityDomain.findByIdAndDelete(domainId);

    // Remove domain from authorities
    // This is expensive if many authorities. But safe.
    if (domainId) {
        await models.Authority.updateMany({ domain: domainId } as any, { domain: null } as any);
    }

    return returnResponse(res, 200, "Domain deleted successfully", {
        success: true,
        data: null
    });
});

// Get all complaints for authority's domain
const getDomainComplaints = asyncHandler(async (req: Request, res: Response) => {
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    // Get authority's domain
    const authority = await models.Authority.findById(authorityId);
    let domainId = authority?.domain;

    if (!domainId) {
        // Fallback: Check if authority is in any domain's authorities array
        const domain = await models.AuthorityDomain.findOne({ authorities: authorityId });
        if (domain) {
            domainId = domain._id;
            // Self-repair: Update Authority with this domain
            await models.Authority.findByIdAndUpdate(authorityId, { domain: domainId });
        }
    }

    if (!domainId) {
        return returnResponse(res, 404, "You don't have a domain assigned", { success: false, data: null });
    }

    // Get problems for this domain that are either unassigned (acceptedBy: null) OR assigned to this authority
    const problems = await models.Problem.find({
        domain: domainId,
        $or: [
            { acceptedBy: null },
            { acceptedBy: { $exists: false } }, // Handle legacy documents
            { acceptedBy: authorityId }
        ]
    })
        .populate("student", "name email")
        .populate("acceptedBy", "name email")
        .populate("comments.by", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Complaints fetched successfully", {
        success: true,
        data: problems
    });
});

// Accept/Assign complaint to authority
const acceptComplaint = asyncHandler(async (req: Request, res: Response) => {
    const { problemId } = req.params;
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const problem = await models.Problem.findById(problemId);

    if (!problem) {
        return returnResponse(res, 404, "Complaint not found", { success: false, data: null });
    }

    // Verify authority belongs to the problem's domain
    const authority = await models.Authority.findById(authorityId);
    if (!authority || !authority.domain || authority.domain.toString() !== problem.domain.toString()) {
        return returnResponse(res, 403, "This complaint is not in your domain", { success: false, data: null });
    }

    // Check if already accepted
    if (problem.acceptedBy && problem.acceptedBy.toString() !== authorityId.toString()) {
        return returnResponse(res, 400, "Complaint already accepted by someone else", { success: false, data: null });
    }

    problem.acceptedBy = authorityId;
    problem.status = "progress";
    await problem.save();

    const updatedProblem = await models.Problem.findById(problemId)
        .populate("student", "name email")
        .populate("acceptedBy", "name email")
        .populate("comments.by", "name email");

    return returnResponse(res, 200, "Complaint accepted", {
        success: true,
        data: updatedProblem
    });
});

// Transfer complaint to another authority in the same domain
const transferComplaint = asyncHandler(async (req: Request, res: Response) => {
    const { problemId } = req.params;
    const { targetAuthorityId } = req.body;
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const problem = await models.Problem.findById(problemId);
    if (!problem) return returnResponse(res, 404, "Complaint not found", { success: false, data: null });

    // Verify current authority owns this problem
    if (problem.acceptedBy?.toString() !== authorityId.toString()) {
        return returnResponse(res, 403, "You can only transfer complaints you have accepted", { success: false, data: null });
    }

    // Verify target authority is in the same domain
    const targetAuthority = await models.Authority.findById(targetAuthorityId);
    if (!targetAuthority || !targetAuthority.domain || targetAuthority.domain.toString() !== problem.domain.toString()) {
        return returnResponse(res, 400, "Target authority is not in the same domain", { success: false, data: null });
    }

    problem.acceptedBy = targetAuthorityId;
    await problem.save();

    return returnResponse(res, 200, "Complaint transferred successfully", {
        success: true,
        data: problem
    });
});

// Update complaint status
const updateComplaintStatus = asyncHandler(async (req: Request, res: Response) => {
    const { problemId } = req.params;
    const { status, comment } = req.body; // Added comment support
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    if (!["new", "progress", "resolved"].includes(status)) {
        return returnResponse(res, 400, "Invalid status", { success: false, data: null });
    }

    if (!comment) {
        return returnResponse(res, 400, "A comment is required to change the state", { success: false, data: null });
    }

    const problem = await models.Problem.findById(problemId);

    if (!problem) {
        return returnResponse(res, 404, "Complaint not found", { success: false, data: null });
    }

    // Check if authority is handling this complaint (acceptedBy)
    if (problem.acceptedBy?.toString() !== authorityId.toString()) {
        return returnResponse(res, 403, "You are not assigned to this complaint", { success: false, data: null });
    }

    problem.status = status as "new" | "progress" | "resolved";

    // Add comment
    problem.comments.push({
        text: comment,
        by: authorityId,
        createdAt: new Date()
    });

    await problem.save();

    const updatedProblem = await models.Problem.findById(problemId)
        .populate("student", "name email")
        .populate("acceptedBy", "name email")
        .populate("comments.by", "name email");

    return returnResponse(res, 200, "Complaint status updated", {
        success: true,
        data: updatedProblem
    });
});

// Get authority's assigned complaints
const getAssignedComplaints = asyncHandler(async (req: Request, res: Response) => {
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const problems = await models.Problem.find({ acceptedBy: authorityId })
        .populate("student", "name email")
        .populate("domain", "name")
        .populate("acceptedBy", "name email")
        .populate("comments.by", "name email")
        .sort({ createdAt: -1 });

    return returnResponse(res, 200, "Assigned complaints fetched", {
        success: true,
        data: problems
    });
});

// Get colleagues in the same domain
const getDomainColleagues = asyncHandler(async (req: Request, res: Response) => {
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const authority = await models.Authority.findById(authorityId);

    if (!authority || !authority.domain) {
        return returnResponse(res, 404, "You don't have a domain assigned", { success: false, data: null });
    }

    const domain = await models.AuthorityDomain.findById(authority.domain).populate("authorities", "name email");

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    // Filter out self
    const colleagues = domain.authorities.filter((auth: any) => auth._id.toString() !== authorityId.toString());

    return returnResponse(res, 200, "Colleagues fetched", {
        success: true,
        data: colleagues
    });
});

// Get stats for the authority dashboard
const getAuthorityStats = asyncHandler(async (req: Request, res: Response) => {
    const authorityId = (req as any).user?._id;

    if (!authorityId) {
        return returnResponse(res, 401, "Unauthorized", { success: false, data: null });
    }

    const authority = await models.Authority.findById(authorityId);
    if (!authority || !authority.domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    const domainId = authority.domain;

    // Aggregate stats for the entire domain
    const totalRequests = await models.Problem.countDocuments({ domain: domainId });
    const pendingDomain = await models.Problem.countDocuments({ domain: domainId, status: "new", acceptedBy: null });
    const inProgressDomain = await models.Problem.countDocuments({ domain: domainId, status: "progress" });
    const resolvedDomain = await models.Problem.countDocuments({ domain: domainId, status: "resolved" });

    // Stats for the current authority
    const assignedToMe = await models.Problem.countDocuments({ acceptedBy: authorityId });
    const myInProgress = await models.Problem.countDocuments({ acceptedBy: authorityId, status: "progress" });
    const myResolved = await models.Problem.countDocuments({ acceptedBy: authorityId, status: "resolved" });

    // Priority stats
    const highPriority = await models.Problem.countDocuments({ domain: domainId, priority: "high", status: { $ne: "resolved" } });

    return returnResponse(res, 200, "Stats fetched successfully", {
        success: true,
        data: {
            domain: {
                total: totalRequests,
                pending: pendingDomain,
                inProgress: inProgressDomain,
                resolved: resolvedDomain,
                highPriority: highPriority
            },
            personal: {
                total: assignedToMe,
                inProgress: myInProgress,
                resolved: myResolved
            }
        }
    });
});

export {
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
};
