import { Admin } from "../models/admin.models.js";
import { Student } from "../models/student.models.js";
import { Faculty } from "../models/faculty.models.js";
import { Authority, AuthorityDomain } from "../models/authority.models.js";
import { Class } from "../models/class.models.js";
import Event from "../models/event.models.js";
import Problem from "../models/problem.models.js";
import { AllowStudent } from "../models/allowStudent.models.js";
import { Lecture } from "../models/lecture.models.js";
import { Note } from "../models/note.models.js";
import { PastPaper } from "../models/pastPaper.models.js";
import { Discussion, Reply } from "../models/discussion.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Grade } from "../models/grade.models.js";
import { LostFound } from "../models/lostFound.models.js";
import { Marketplace } from "../models/marketplace.models.js";
import { ForumPost } from "../models/forum.models.js";
import { CampusLocation } from "../models/campusLocation.models.js";
import { EmergencySOS } from "../models/emergencySOS.models.js";
import { Club } from "../models/club.models.js";
import { CampusAnnouncement } from "../models/campusAnnouncement.models.js";

// @ts-ignore
export const models = {
    "Admin": Admin,
    "Student": Student,
    "Faculty": Faculty,
    "Authority": Authority,
    "AuthorityDomain": AuthorityDomain,
    "Class": Class,
    "Event": Event,
    "Problem": Problem,
    "AllowStudent": AllowStudent,
    "Lecture": Lecture,
    "Note": Note,
    "PastPaper": PastPaper,
    "Discussion": Discussion,
    "Reply": Reply,
    "Attendance": Attendance,
    "Grade": Grade,
    "LostFound": LostFound,
    "Marketplace": Marketplace,
    "ForumPost": ForumPost,
    "CampusLocation": CampusLocation,
    "EmergencySOS": EmergencySOS,
    "Club": Club,
    "CampusAnnouncement": CampusAnnouncement
}