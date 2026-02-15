
import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/Dashboard.css'; // Reuse existing styles or move to common.css
import { ThemeContext } from '../theme/ThemeProvider';

const Layout = ({ role, title, subtitle, user, activeTab, onTabChange, children, theme, toggleTheme }) => {
    const ctx = useContext(ThemeContext);
    const themeToUse = theme || (ctx && ctx.theme) || 'light';
    const toggleToUse = toggleTheme || (ctx && ctx.toggleTheme) || (() => { });

    return (
        <div className="dashboard-container" data-theme={themeToUse}>
            <Sidebar
                role={role}
                activeTab={activeTab}
                onTabChange={onTabChange}
                theme={themeToUse}
                toggleTheme={toggleToUse}
            />

            <main className="main-content">
                <Header
                    title={title}
                    subtitle={subtitle}
                    user={user}
                    theme={themeToUse}
                    toggleTheme={toggleToUse}
                />

                <div className="content-scrollable">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
