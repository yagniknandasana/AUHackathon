import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaTrophy, FaProjectDiagram, FaBookOpen } from 'react-icons/fa';

const Dashboard = () => {
    // Mock Data
    const skillData = [
        { subject: 'Data Analysis', A: 120, fullMark: 150 },
        { subject: 'Health Tech', A: 98, fullMark: 150 },
        { subject: 'IoT Systems', A: 86, fullMark: 150 },
        { subject: 'Project Mgmt', A: 99, fullMark: 150 },
        { subject: 'Urban Plan', A: 85, fullMark: 150 },
        { subject: 'Communication', A: 65, fullMark: 150 },
    ];

    const progressData = [
        { name: 'Jan', score: 40 },
        { name: 'Feb', score: 45 },
        { name: 'Mar', score: 55 },
        { name: 'Apr', score: 70 },
        { name: 'May', score: 85 },
        { name: 'Jun', score: 92 },
    ];

    const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: `rgba(${color}, 0.2)`, color: `rgb(${color})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
            }}>
                <Icon />
            </div>
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{title}</h3>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{subtext}</div>
            </div>
        </div>
    );

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, Alex</h1>
                <p style={{ color: 'var(--text-muted)' }}>Here is your skill intelligence overview for this week.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={FaTrophy} title="Skill Score" value="842" subtext="Top 5% of Peers" color="236, 72, 153" />
                <StatCard icon={FaBookOpen} title="Active Courses" value="3" subtext="12 Hours Remaining" color="99, 102, 241" />
                <StatCard icon={FaProjectDiagram} title="Completed Projects" value="7" subtext="2 in Portfolio" color="6, 182, 212" />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                {/* Progress Chart */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Learning Trajectory</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={progressData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                                    itemStyle={{ color: '#818cf8' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Radar */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Competency Map</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="My Skills" dataKey="A" stroke="#06b6d4" strokeWidth={3} fill="#06b6d4" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recommended Next Steps</h3>
                <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h4 style={{ fontSize: '1.1rem' }}>Smart Cities: Urban Data Analytics</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill your 'Data Analysis' gap to unlock Senior roles.</p>
                    </div>
                    <button className="glass-button">Start Now</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
