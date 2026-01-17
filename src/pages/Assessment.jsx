import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Assessment = () => {
    const data = [
        { skill: 'Data Vis', user: 70, industry: 90 },
        { skill: 'Systems Thinking', user: 60, industry: 85 },
        { skill: 'IOT Fundamentals', user: 85, industry: 80 },
        { skill: 'Python/R', user: 50, industry: 90 },
        { skill: 'UX Research', user: 65, industry: 70 },
    ];

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Skill Gap Analysis</h1>
                <p style={{ color: 'var(--text-muted)' }}>Comparing your profile against <strong>Smart City Specialist</strong> roles.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Chart Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Skill Comparison</h3>
                    <div style={{ height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="skill" type="category" stroke="#94a3b8" width={100} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                                />
                                <Legend />
                                <Bar dataKey="user" name="Your Score" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="industry" name="Industry Benchmark" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Actionable Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Critical Gaps Detected</h3>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <FaExclamationTriangle style={{ color: '#f43f5e', fontSize: '1.5rem', flexShrink: 0 }} />
                            <div>
                                <h4 style={{ color: '#f43f5e', marginBottom: '0.5rem' }}>Python/R Programming</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Your score (50%) is significantly below the industry standard (90%). This is a core requirement using Data Science in Urban Systems.
                                </p>
                                <button className="glass-button" style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>View Course</button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #eab308' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <FaExclamationTriangle style={{ color: '#eab308', fontSize: '1.5rem', flexShrink: 0 }} />
                            <div>
                                <h4 style={{ color: '#eab308', marginBottom: '0.5rem' }}>Systems Thinking</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Moderate gap identified. Recommended to undertake a holistic design project.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #22c55e' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                            <FaCheckCircle style={{ color: '#22c55e', fontSize: '1.5rem', flexShrink: 0 }} />
                            <div>
                                <h4 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>IoT Fundamentals</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Great job! You are exceeding industry expectations in this area.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Assessment;
