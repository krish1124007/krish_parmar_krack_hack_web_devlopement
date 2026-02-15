
import React from 'react';
import Chart from '../../../components/Chart';
import { Users, School, Building2, GraduationCap } from 'lucide-react';

const OverviewSection = ({ statsData, chartData }) => {
    // Default stats if empty
    const stats = statsData || [
        { title: 'Total Students', value: 0, icon: GraduationCap, color: 'blue' },
        { title: 'Total Faculty', value: 0, icon: Users, color: 'green' },
        { title: 'Authorities', value: 0, icon: Building2, color: 'orange' },
        { title: 'Active Classes', value: 0, icon: School, color: 'purple' },
    ];

    const defaultChartData = chartData || [
        { label: 'Jan', students: 80, faculty: 20 },
        { label: 'Feb', students: 120, faculty: 25 },
        { label: 'Mar', students: 160, faculty: 30 },
        { label: 'Apr', students: 200, faculty: 40 },
        { label: 'May', students: 240, faculty: 45 },
    ];

    return (
        <div className="dashboard-grid split-grid">
            {/* Stats Overview */}
            <div className="stats-section" style={{ gridColumn: 'span 2' }}>
                <div className="dashboard-grid" style={{ marginTop: 0 }}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="action-card stat-card">
                                <div className={`icon-bg bg-${stat.color}-100 text-${stat.color}-600`}>
                                    <Icon size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>{stat.value}</h3>
                                    <p>{stat.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CSS Chart */}
                <div className="chart-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h2>Growth Analytics</h2>
                        <select className="chart-select">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="chart-container" style={{ width: '100%', height: 260 }}>
                        <Chart data={defaultChartData} />
                    </div>
                    <div className="chart-legend" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="status-indicator" style={{ background: '#3b82f6' }}></span> Students</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="status-indicator" style={{ background: '#10b981' }}></span> Faculty</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;
