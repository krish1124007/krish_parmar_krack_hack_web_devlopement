/**
 * API Configuration
 * Centralized API base URL configuration for the entire application
 * 
 * To change the API URL:
 * - For development: Use localhost URL
 * - For production: Use your deployed backend URL
 * 
 * You can also use environment variables:
 * - Create a .env file in the root of your project
 * - Add: VITE_API_BASE_URL=https://your-backend-url.com
 * - The config will automatically use the env variable if available
 */

// Determine the API base URL
// Priority: Environment variable > Production default > Development default
const getApiBaseUrl = () => {
    // Check if environment variable is set (Vite uses VITE_ prefix)
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // Use production URL if in production mode
    if (import.meta.env.PROD) {
        // Replace this with your actual deployed backend URL
        return 'https://krish-parmar-krack-hack-web-devlopement.onrender.com';
    }

    // Development URL
    return 'https://krish-parmar-krack-hack-web-devlopement.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_VERSION = 'v1';
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Specific API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: (role) => `${API_URL}/${role}/login`,

    // Student
    STUDENT: {
        PROFILE: `${API_URL}/student/profile`,
        EXPLORE_CLASSES: `${API_URL}/student/explore-classes`,
        ENROLL_CLASS: `${API_URL}/student/enroll-class`,
        CLASS: (classId) => `${API_URL}/student/class/${classId}`,
        CLASS_NOTE: (classId) => `${API_URL}/student/class/${classId}/note`,
        GET_DOMAINS: `${API_URL}/student/get-domains`,
    },

    // Faculty
    FACULTY: {
        MY_CLASSES: `${API_URL}/faculty/my-classes`,
        CLASS: (classId) => `${API_URL}/faculty/class/${classId}`,
        LECTURE: (classId) => `${API_URL}/faculty/class/${classId}/lecture`,
        ATTENDANCE: (classId) => `${API_URL}/faculty/class/${classId}/attendance`,
        GRADE: (classId) => `${API_URL}/faculty/class/${classId}/grade`,
        NOTE: (classId) => `${API_URL}/faculty/class/${classId}/note`,
        DISCUSSION: (classId) => `${API_URL}/faculty/class/${classId}/discussion`,
        REPLY: (discussionId) => `${API_URL}/faculty/discussion/${discussionId}/reply`,
    },

    // Admin
    ADMIN: {
        GET_FACULTIES: `${API_URL}/admin/get-faculties`,
        GET_STUDENTS: `${API_URL}/admin/get-students`,
        GET_AUTHORITIES: `${API_URL}/admin/get-authorities`,
        GET_CLASSES: `${API_URL}/admin/get-classes`,
        CREATE_STUDENT: `${API_URL}/admin/create-student`,
        BULK_CREATE_STUDENTS: `${API_URL}/admin/bulk-create-students`,
        DELETE_STUDENT: (id) => `${API_URL}/admin/delete-student/${id}`,
        CREATE_FACULTY: `${API_URL}/admin/create-faculty`,
        DELETE_FACULTY: (id) => `${API_URL}/admin/delete-faculty/${id}`,
        CREATE_CLASS: `${API_URL}/admin/create-class`,
        DELETE_CLASS: (id) => `${API_URL}/admin/delete-class/${id}`,
        GET_DOMAINS: `${API_URL}/admin/get-domains`,
        CREATE_DOMAIN: `${API_URL}/admin/create-domain`,
        CREATE_AUTHORITY: `${API_URL}/admin/create-authority`,
        DELETE_AUTHORITY: (id) => `${API_URL}/admin/delete-authority/${id}`,
    },

    // Authority
    AUTHORITY: {
        COMPLAINTS: `${API_URL}/authority/complaints`,
        COLLEAGUES: `${API_URL}/authority/colleagues`,
        ACCEPT_COMPLAINT: (id) => `${API_URL}/authority/complaints/${id}/accept`,
        UPDATE_STATUS: (id) => `${API_URL}/authority/complaints/${id}/status`,
        TRANSFER_COMPLAINT: (id) => `${API_URL}/authority/complaints/${id}/transfer`,
        STATS: `${API_URL}/authority/stats`,
    },

    // Problems
    PROBLEM: {
        CREATE: `${API_URL}/problem/create`,
        STUDENT_PROBLEMS: `${API_URL}/problem/student/problems`,
        ALL: `${API_URL}/problem/all`,
        UPDATE: (id) => `${API_URL}/problem/update/${id}`,
    },

    // Events
    EVENT: {
        BASE: `${API_URL}/event`,
        CREATE: `${API_URL}/event/create`,
        FACULTY_EVENTS: `${API_URL}/event/faculty/events`,
        STUDENT_EVENTS: `${API_URL}/event/student/events`,
        REGISTER: (eventId) => `${API_URL}/event/register/${eventId}`,
        UNREGISTER: (eventId) => `${API_URL}/event/unregister/${eventId}`,
        ALL: `${API_URL}/event/all`,
        UPDATE: (eventId) => `${API_URL}/event/update/${eventId}`,
        DELETE: (eventId) => `${API_URL}/event/delete/${eventId}`,
        DETAILS: (eventId) => `${API_URL}/event/${eventId}`,
    },

    // Clubs
    CLUB: {
        BASE: `${API_URL}/club`,
        CREATE: `${API_URL}/club/create`,
        ALL: `${API_URL}/club/all`,
        DETAILS: (clubId) => `${API_URL}/club/${clubId}`,
        JOIN: (clubId) => `${API_URL}/club/${clubId}/join`,
        LEAVE: (clubId) => `${API_URL}/club/${clubId}/leave`,
    }
};

export default {
    API_BASE_URL,
    API_VERSION,
    API_URL,
    API_ENDPOINTS,
};
