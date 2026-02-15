
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { API_ENDPOINTS } from '../../config/api.config';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    School,
    Building2,
    GraduationCap,
} from 'lucide-react';
import Layout from '../../components/Layout';
import '../../styles/Dashboard.css';

// Import Components
import OverviewSection from './components/OverviewSection';
import FacultyManagement from './components/FacultyManagement';
import ClassManagement from './components/ClassManagement';
import StudentManagement from './components/StudentManagement';
import AuthorityManagement from './components/AuthorityManagement';
import AnnouncementManagement from './components/AnnouncementManagement';

//this is comment
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [message, setMessage] = useState('');

    // Data States
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);
    const [authorities, setAuthorities] = useState([]);
    const [classes, setClasses] = useState([]);

    // Fetch Data
    const fetchData = async () => {
        try {
            const [facRes, stuRes, authRes, classRes] = await Promise.all([
                apiFetch(API_ENDPOINTS.ADMIN.GET_FACULTIES),
                apiFetch(API_ENDPOINTS.ADMIN.GET_STUDENTS),
                apiFetch(API_ENDPOINTS.ADMIN.GET_AUTHORITIES),
                apiFetch(API_ENDPOINTS.ADMIN.GET_CLASSES)
            ]);

            const facData = await facRes.json();
            const stuData = await stuRes.json();
            const authData = await authRes.json();
            const classData = await classRes.json();

            if (facData.data && facData.data.success) setFaculties(facData.data.data);
            if (stuData.data && stuData.data.success) setStudents(stuData.data.data);
            if (authData.data && authData.data.success) setAuthorities(authData.data.data);
            if (classData.data && classData.data.success) setClasses(classData.data.data);

        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Stats
    const stats = [
        { title: 'Total Students', value: students.length, icon: GraduationCap, color: 'blue' },
        { title: 'Total Faculty', value: faculties.length, icon: Users, color: 'green' },
        { title: 'Authorities', value: authorities.length, icon: Building2, color: 'orange' },
        { title: 'Active Classes', value: classes.length, icon: School, color: 'purple' },
    ];

    const chartData = [ // Mock Chart Data
        { label: 'Jan', students: 80, faculty: 20 },
        { label: 'Feb', students: 120, faculty: 25 },
        { label: 'Mar', students: 160, faculty: 30 },
        { label: 'Apr', students: 200, faculty: 40 },
        { label: 'May', students: 240, faculty: 45 },
    ];

    return (
        <Layout
            role="admin"
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            subtitle="Admin Portal"
            user={{ name: 'Admin' }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            {message && <div className="status-toast success">{message}</div>}

            {activeTab === 'dashboard' && (
                <OverviewSection
                    statsData={stats}
                    chartData={chartData}
                />
            )}

            {activeTab === 'faculty' && (
                <FacultyManagement
                    faculties={faculties}
                    onRefresh={fetchData}
                />
            )}

            {activeTab === 'classes' && (
                <ClassManagement
                    classes={classes}
                    faculties={faculties}
                    onRefresh={fetchData}
                />
            )}

            {activeTab === 'student' && (
                <StudentManagement
                    students={students}
                    classes={classes}
                    onRefresh={fetchData}
                />
            )}

            {activeTab === 'authority' && (
                <AuthorityManagement
                    authorities={authorities}
                    onRefresh={fetchData}
                />
            )}

            {activeTab === 'announcements' && (
                <AnnouncementManagement
                    onRefresh={fetchData}
                />
            )}
        </Layout>
    );
};

export default AdminDashboard;
