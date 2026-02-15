import { Router } from "express";
import {
    createClass,
    createFaculty,
    getAllFaculties,
    deleteFaculty,
    getAllAuthorities,
    deleteAuthority,
    getAllStudents,
    deleteStudent,
    getAllClasses,
    deleteClass,
    createStudent,
    bulkCreateStudents,
    sendWorkReportToAuthority
} from "../controllers/admin/admin.controller.js";
import {
    createAuthority,
    createAuthorityDomain,
    getAllAuthorityDomains,
    getAuthoritiesByDomain,
    addAuthorityToDomain
} from "../controllers/admin/authority.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginAdmin, registerAdmin } from "../controllers/admin/admin.auth.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/login").post(loginAdmin);
router.route("/register").post(registerAdmin);

// Protected Routes (Admin Only)
router.use(verifyJWT, verifyRole(["admin", "Admin"]));

router.route("/create-class").post(createClass);
router.route("/create-faculty").post(createFaculty);
router.route("/create-authority").post(createAuthority);

// Faculty Routes
// ... rest of routes will inherit the middleware applied above

// Faculty Routes
router.route("/get-faculties").get(getAllFaculties);
router.route("/delete-faculty/:id").delete(deleteFaculty);

// Authority Routes
router.route("/get-authorities").get(getAllAuthorities);
router.route("/delete-authority/:id").delete(deleteAuthority);

// Authority Domain Routes
router.route("/create-domain").post(createAuthorityDomain);
router.route("/get-domains").get(getAllAuthorityDomains);
router.route("/get-domain-authorities/:domainId").get(getAuthoritiesByDomain);
router.route("/add-authority-to-domain").post(addAuthorityToDomain);

// Student Routes
router.route("/get-students").get(getAllStudents);
router.route("/create-student").post(createStudent);
router.route("/bulk-create-students").post(upload.single("file"), bulkCreateStudents);
router.route("/delete-student/:id").delete(deleteStudent);

// Class Routes
router.route("/get-classes").get(getAllClasses);
router.route("/delete-class/:id").delete(deleteClass);

// Work Report Route
router.route("/send-work-report").post(sendWorkReportToAuthority);

export default router;
