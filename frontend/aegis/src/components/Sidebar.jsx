import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Building2,
    Settings,
    LogOut,
    FileText,
    AlertCircle,
    AlertTriangle,
    School,
    CheckCircle,
    Moon,
    Sun,
    Calendar,
    BookOpen,
    Heart,
    ShoppingCart,
    MessageCircle,
    Map,
    AlertOctagon,
    Users2,
    Megaphone
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ role, activeTab, onTabChange, theme, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleNavigation = (path, tabName) => {
        if (onTabChange) {
            onTabChange(tabName);
        }
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    const renderNavItems = () => {
        switch (role) {
            case 'admin':
                return (
                    <>
                        <button
                            className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'dashboard')}
                            title="Dashboard"
                        >
                            <div className="nav-icon"><LayoutDashboard size={20} /></div>
                            <span className="nav-label">Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/admin/problems') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/problems', 'problems')}
                            title="Problems"
                        >
                            <div className="nav-icon"><AlertCircle size={20} /></div>
                            <span className="nav-label">Problems</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/admin/events') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/events', 'events')}
                            title="Events"
                        >
                            <div className="nav-icon"><Calendar size={20} /></div>
                            <span className="nav-label">Events</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'classes')}
                            title="Classes"
                        >
                            <div className="nav-icon"><School size={20} /></div>
                            <span className="nav-label">Classes</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'faculty')}
                            title="Faculty"
                        >
                            <div className="nav-icon"><Users size={20} /></div>
                            <span className="nav-label">Faculty</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'student' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'student')}
                            title="Students"
                        >
                            <div className="nav-icon"><GraduationCap size={20} /></div>
                            <span className="nav-label">Students</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'authority' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'authority')}
                            title="Authority"
                        >
                            <div className="nav-icon"><Building2 size={20} /></div>
                            <span className="nav-label">Authority</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/clubs') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/clubs', 'clubs')}
                            title="Clubs"
                        >
                            <div className="nav-icon"><Users2 size={20} /></div>
                            <span className="nav-label">Clubs</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'announcements' ? ' active' : ''}`}
                            onClick={() => handleNavigation('/admin/dashboard', 'announcements')}
                            title="Announcements"
                        >
                            <div className="nav-icon"><Megaphone size={20} /></div>
                            <span className="nav-label">Announcements</span>
                        </button>
                    </>
                );
            case 'authority':
                return (
                    <>
                        <button
                            className={`nav-item ${isActive('/authority/dashboard') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/authority/dashboard', 'dashboard')}
                            title="Dashboard"
                        >
                            <div className="nav-icon"><LayoutDashboard size={20} /></div>
                            <span className="nav-label">Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/authority/problems') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/authority/problems', 'problems')}
                            title="Problems"
                        >
                            <div className="nav-icon"><AlertTriangle size={20} /></div>
                            <span className="nav-label">Problems</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/authority/dashboard', 'reports')}
                            title="Reports"
                        >
                            <div className="nav-icon"><FileText size={20} /></div>
                            <span className="nav-label">Reports</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/authority/dashboard', 'settings')}
                            title="Settings"
                        >
                            <div className="nav-icon"><Settings size={20} /></div>
                            <span className="nav-label">Settings</span>
                        </button>
                    </>
                );
            case 'student':
                return (
                    <>
                        <button
                            className={`nav-item ${isActive('/student/dashboard') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/dashboard', 'dashboard')}
                            title="Dashboard"
                        >
                            <div className="nav-icon"><LayoutDashboard size={20} /></div>
                            <span className="nav-label">Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'my-classes' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/dashboard', 'my-classes')}
                            title="My Classes"
                        >
                            <div className="nav-icon"><BookOpen size={20} /></div>
                            <span className="nav-label">My Classes</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/student/events') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/events', 'events')}
                            title="Events"
                        >
                            <div className="nav-icon"><Calendar size={20} /></div>
                            <span className="nav-label">Events</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/student/problems') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/problems', 'problems')}
                            title="Problems"
                        >
                            <div className="nav-icon"><AlertCircle size={20} /></div>
                            <span className="nav-label">Problems</span>
                        </button>

                        {/* Community Features Section */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0', paddingTop: '15px' }}></div>

                        <button
                            className={`nav-item ${isActive('/student/lost-found') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/lost-found', 'lost-found')}
                            title="Lost & Found"
                        >
                            <div className="nav-icon"><Heart size={20} /></div>
                            <span className="nav-label">Lost & Found</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/student/marketplace') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/marketplace', 'marketplace')}
                            title="Marketplace"
                        >
                            <div className="nav-icon"><ShoppingCart size={20} /></div>
                            <span className="nav-label">Marketplace</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/forum') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/forum', 'forum')}
                            title="Forum"
                        >
                            <div className="nav-icon"><MessageCircle size={20} /></div>
                            <span className="nav-label">Forum</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/campus/map') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/campus/map', 'campus-map')}
                            title="Campus Map"
                        >
                            <div className="nav-icon"><Map size={20} /></div>
                            <span className="nav-label">Campus Map</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/campus/emergency') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/campus/emergency', 'emergency')}
                            title="Emergency SOS"
                        >
                            <div className="nav-icon"><AlertOctagon size={20} /></div>
                            <span className="nav-label">Emergency</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/clubs') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/clubs', 'clubs')}
                            title="Clubs"
                        >
                            <div className="nav-icon"><Users2 size={20} /></div>
                            <span className="nav-label">Clubs</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/campus/announcements') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/campus/announcements', 'announcements')}
                            title="Announcements"
                        >
                            <div className="nav-icon"><Megaphone size={20} /></div>
                            <span className="nav-label">Announcements</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/dashboard', 'classes')}
                            title="Explore Classes"
                        >
                            <div className="nav-icon"><School size={20} /></div>
                            <span className="nav-label">Explore Classes</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/dashboard', 'grades')}
                            title="Grades"
                        >
                            <div className="nav-icon"><CheckCircle size={20} /></div>
                            <span className="nav-label">Grades</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/student/profile') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/student/profile', 'profile')}
                            title="My Profile"
                        >
                            <div className="nav-icon"><Settings size={20} /></div>
                            <span className="nav-label">My Profile</span>
                        </button>
                    </>
                );
            case 'faculty':
                return (
                    <>
                        <button
                            className={`nav-item ${isActive('/faculty/dashboard') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/faculty/dashboard', 'dashboard')}
                            title="Dashboard"
                        >
                            <div className="nav-icon"><LayoutDashboard size={20} /></div>
                            <span className="nav-label">Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/faculty/events') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/faculty/events', 'events')}
                            title="Events"
                        >
                            <div className="nav-icon"><Calendar size={20} /></div>
                            <span className="nav-label">Events</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/faculty/dashboard', 'classes')}
                            title="My Classes"
                        >
                            <div className="nav-icon"><School size={20} /></div>
                            <span className="nav-label">My Classes</span>
                        </button>
                        <button
                            className={`nav-item ${isActive('/campus/announcements') ? 'active' : ''}`}
                            onClick={() => handleNavigation('/campus/announcements', 'announcements')}
                            title="Announcements"
                        >
                            <div className="nav-icon"><Megaphone size={20} /></div>
                            <span className="nav-label">Announcements</span>
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <aside className="icon-sidebar">
            <div className="sidebar-top">
                <div className="logo-icon">A</div>
            </div>

            <nav className="sidebar-nav">
                {renderNavItems()}
            </nav>

            <div className="sidebar-footer">
                {toggleTheme && (
                    <button onClick={toggleTheme} className="nav-item theme-btn" title="Toggle Theme">
                        <div className="nav-icon"><span className="sr-only"></span>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</div>
                        <span className="nav-label">Theme</span>
                    </button>
                )}
                <button onClick={handleLogout} className="nav-item logout-btn" title="Logout">
                    <div className="nav-icon"><LogOut size={18} /></div>
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
