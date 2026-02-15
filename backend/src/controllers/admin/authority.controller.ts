import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnResponse } from "../../utils/apiResponse.js";
import { models } from "../../admin/model.register.js";
import type { Request, Response } from "express";

const createAuthority = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
        console.log(email, password, name, role)
        return returnResponse(res, 400, "Email, password, and name are required", { success: false, data: null });
    }

    const authority = await models.Authority.create({
        email,
        password,
        name,
        department: "",
        role: role || "Authority"  // Default to "Authority" if not provided, ensure consistency
    });

    if (!authority) {
        return returnResponse(res, 500, "Authority creation failed", { success: false, data: null });
    }

    return returnResponse(res, 201, "Authority created successfully", { success: true, data: authority });
});

const loginAuthority = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return returnResponse(res, 400, "All fields are required", { success: false, data: null });
    }

    const authority = await models.Authority.findOne({ email });

    if (!authority) {
        return returnResponse(res, 404, "Authority not found", { success: false, data: null });
    }

    const isPasswordCorrect = await (authority as any).isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return returnResponse(res, 401, "Invalid password", { success: false, data: null });
    }

    const accessToken = (authority as any).generateAccessToken();

    return returnResponse(res, 200, "Login successful", {
        success: true,
        data: {
            authority,
            accessToken
        }
    });
});


// // --- Authority Domain Management ---
const createAuthorityDomain = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        return returnResponse(res, 400, "Domain name is required", { success: false, data: null });
    }

    const existingDomain = await models.AuthorityDomain.findOne({ name });
    if (existingDomain) {
        return returnResponse(res, 400, "Domain already exists", { success: false, data: null });
    }

    const domain = await models.AuthorityDomain.create({
        name,
        description: description || "",
        authorities: []
    });

    return returnResponse(res, 201, "Authority Domain created successfully", { success: true, data: domain });
});

const getAllAuthorityDomains = asyncHandler(async (req: Request, res: Response) => {
    const domains = await models.AuthorityDomain.find().populate("authorities", "name email role");
    // console.log(domains)
    return returnResponse(res, 200, "All domains fetched successfully", { success: true, data: domains });
});

const getAuthoritiesByDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domainId } = req.params;
    const domain = await models.AuthorityDomain.findById(domainId).populate("authorities");

    if (!domain) {
        return returnResponse(res, 404, "Domain not found", { success: false, data: null });
    }

    return returnResponse(res, 200, "Authorities fetched for domain", { success: true, data: domain.authorities });
});

const addAuthorityToDomain = asyncHandler(async (req: Request, res: Response) => {
    const { domainId, authorityId } = req.body;

    const domain = await models.AuthorityDomain.findById(domainId);
    if (!domain) return returnResponse(res, 404, "Domain not found", { success: false, data: null });

    const authority = await models.Authority.findById(authorityId);
    if (!authority) return returnResponse(res, 404, "Authority not found", { success: false, data: null });

    // Update Authority
    authority.domain = domainId;
    await authority.save();

    // Update Domain
    if (!domain.authorities.includes(authorityId)) {
        domain.authorities.push(authorityId);
        await domain.save();
    }

    return returnResponse(res, 200, "Authority added to domain successfully", { success: true, data: domain });
});

export {
    createAuthority,
    loginAuthority,
    createAuthorityDomain,
    getAllAuthorityDomains,
    getAuthoritiesByDomain,
    addAuthorityToDomain
};
