
// // --- Authority Domain Management ---
// const createAuthorityDomain = asyncHandler(async (req: Request, res: Response) => {
//     const { name, description } = req.body;

//     if (!name) {
//         return returnResponse(res, 400, "Domain name is required", { success: false, data: null });
//     }

//     const existingDomain = await models.AuthorityDomain.findOne({ name });
//     if (existingDomain) {
//         return returnResponse(res, 400, "Domain already exists", { success: false, data: null });
//     }

//     const domain = await models.AuthorityDomain.create({
//         name,
//         description: description || "",
//         authorities: []
//     });

//     return returnResponse(res, 201, "Authority Domain created successfully", { success: true, data: domain });
// });

// const getAllAuthorityDomains = asyncHandler(async (req: Request, res: Response) => {
//     const domains = await models.AuthorityDomain.find().populate("authorities", "name email role");
//     return returnResponse(res, 200, "All domains fetched successfully", { success: true, data: domains });
// });

// const getAuthoritiesByDomain = asyncHandler(async (req: Request, res: Response) => {
//     const { domainId } = req.params;
//     const domain = await models.AuthorityDomain.findById(domainId).populate("authorities");

//     if (!domain) {
//         return returnResponse(res, 404, "Domain not found", { success: false, data: null });
//     }

//     return returnResponse(res, 200, "Authorities fetched for domain", { success: true, data: domain.authorities });
// });

// const addAuthorityToDomain = asyncHandler(async (req: Request, res: Response) => {
//     const { domainId, authorityId } = req.body;

//     const domain = await models.AuthorityDomain.findById(domainId);
//     if (!domain) return returnResponse(res, 404, "Domain not found", { success: false, data: null });

//     const authority = await models.Authority.findById(authorityId);
//     if (!authority) return returnResponse(res, 404, "Authority not found", { success: false, data: null });

//     // Update Authority
//     authority.domain = domainId;
//     await authority.save();

//     // Update Domain
//     if (!domain.authorities.includes(authorityId)) {
//         domain.authorities.push(authorityId);
//         await domain.save();
//     }

//     return returnResponse(res, 200, "Authority added to domain successfully", { success: true, data: domain });
// });
