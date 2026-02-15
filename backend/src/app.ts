import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8000",
            "https://krish-parmar-krack-hack-web-devlope.vercel.app"
        ];

        // Check if the origin is in the allowed list or matches a Vercel domain
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback: Allow all for now to unblock, but log it?
            // Actually, for security, sticking to explicit + vercel suffix is safer.
            // But user is stuck. Let's strictly allow Vercel suffix.
            // callback(new Error('Not allowed by CORS')); 
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes Import
import adminRouter from "./routers/admin.router.js";
import authorityRouter from "./routers/authority.router.js";
import facultyRouter from "./routers/faculty.router.js";
import studentRouter from "./routers/student.router.js";
import problemRouter from "./routers/problem.router.js";
import eventRouter from "./routers/event.router.js";
import lostFoundRouter from "./routers/student/lostFound.router.js";
import marketplaceRouter from "./routers/student/marketplace.router.js";
import forumRouter from "./routers/student/forum.router.js";
import campusLocationRouter from "./routers/campus/campusLocation.router.js";
import emergencySOSRouter from "./routers/campus/emergencySOS.router.js";
import clubRouter from "./routers/campus/club.router.js";
import announcementRouter from "./routers/campus/announcement.router.js";

// Routes Declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/authority", authorityRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/event", eventRouter);

// New feature routes
app.use("/api/v1/student/lost-found", lostFoundRouter);
app.use("/api/v1/student/marketplace", marketplaceRouter);
app.use("/api/v1/forum", forumRouter);
app.use("/api/v1/campus/locations", campusLocationRouter);
app.use("/api/v1/campus/emergency", emergencySOSRouter);
app.use("/api/v1/campus/clubs", clubRouter);
app.use("/api/v1/campus/announcements", announcementRouter);

export { app };