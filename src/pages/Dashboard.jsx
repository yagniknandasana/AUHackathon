import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend, RadialBarChart, RadialBar } from 'recharts';
import { FaTrophy, FaProjectDiagram, FaBookOpen, FaUserMd } from 'react-icons/fa';
import { db, auth } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { HEALTHCARE_CAREERS } from '../utils/skillData';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        readiness: 0,
        missingCount: 0,
        weakCount: 0,
        goodCount: 0,
        totalRequired: 0
    });
    const [radarData, setRadarData] = useState([]);
    const [barData, setBarData] = useState([]);

    // Helper: Normalize Levels for Charting
    const getLevelValue = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 30;
            case 'intermediate': return 65;
            case 'advanced': return 100;
            default: return 0;
        }
    };

    useEffect(() => {
        let unsubscribeSnapshot = null;
        const processData = (userProfile) => {
            if (!userProfile || !userProfile.goal) return;

            const storedGoal = userProfile.goal;
            const userSkills = userProfile.skills || [];

            // Determine Target Specialization
            const DOMAIN_TITLES = {
                'health': 'Healthcare Technology',
                'agri': 'Agricultural Technology',
                'city': 'Smart City & Urban Systems'
            };
            const targetTitle = storedGoal?.specialization || DOMAIN_TITLES[storedGoal?.domain] || 'Healthcare Technology';

            // Fetch Required Skills 
            let requiredSkillsData = null;
            if (HEALTHCARE_CAREERS[targetTitle]) {
                requiredSkillsData = HEALTHCARE_CAREERS[targetTitle];
            } else if (['Ayurveda', 'Homeopathy', 'Unani Medicine', 'Siddha Medicine', 'Yoga & Naturopathy', 'Ayurvedic Pharmacy & Herbal Technology', 'Integrative Medicine (Allopathy + AYUSH)'].includes(targetTitle)) {
                requiredSkillsData = HEALTHCARE_CAREERS["AYUSH"];
            }

            let requiredSkills = [];
            if (requiredSkillsData) {
                requiredSkills = [
                    ...requiredSkillsData.skills.core,
                    ...requiredSkillsData.skills.technical,
                    ...requiredSkillsData.skills.supporting
                ].map(s => ({ skill: s.name, requiredLevel: s.requiredLevel }));
            } else {
                // Fallback
                requiredSkills = [{ skill: "Data Analysis", requiredLevel: "Intermediate" }];
            }

            // Calculation
            let totalScore = 0;
            let missing = 0;
            let weak = 0;
            let good = 0;
            const radarChartData = [];

            requiredSkills.forEach(req => {
                const userSkill = userSkills.find(s => s.name.toLowerCase() === req.skill.toLowerCase());
                const reqVal = getLevelValue(req.requiredLevel);
                const userVal = userSkill ? getLevelValue(userSkill.level) : 0;

                // Stats breakdown
                if (!userSkill) missing++;
                else if (userVal < reqVal) weak++;
                else good++;

                // Score calculation (simple ratio)
                let skillScore = 0;
                if (userVal >= reqVal) skillScore = 100;
                else skillScore = (userVal / reqVal) * 100;
                totalScore += skillScore;

                // Radar Data (Top 6 skills only to avoid clutter)
                if (radarChartData.length < 6) {
                    radarChartData.push({
                        subject: req.skill.split(" ")[0], // Shorten name
                        A: userVal, // User
                        B: reqVal,  // Required
                        fullMark: 100
                    });
                }
            });

            const readiness = requiredSkills.length > 0 ? Math.round(totalScore / requiredSkills.length) : 0;

            setStats({
                readiness,
                missingCount: missing,
                weakCount: weak,
                goodCount: good,
                totalRequired: requiredSkills.length
            });

            setRadarData(radarChartData);

            // Bar Data for Status
            setBarData([
                { name: 'Status', Missing: missing, Weak: weak, Good: good }
            ]);

            setUserData({ ...userProfile, targetTitle });
            setLoading(false);
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Setup realtime listener
                if (unsubscribeSnapshot) unsubscribeSnapshot();
                const userDocRef = doc(db, "users", user.uid);

                unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        processData(docSnap.data());
                    } else {
                        // Document doesn't exist (new user)
                        setStats({ readiness: 0, missingCount: 0, weakCount: 0, goodCount: 0, totalRequired: 0 });
                        setRadarData([]);
                        setBarData([]);
                        setUserData({ name: user.displayName });
                        setLoading(false);
                    }
                }, (error) => {
                    console.error("Error fetching realtime data:", error);
                    setLoading(false);
                });

            } else {
                if (unsubscribeSnapshot) unsubscribeSnapshot();

                // LocalStorage Fallback
                const storedGoal = JSON.parse(localStorage.getItem('userGoal'));
                const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
                if (storedGoal && storedProfile) {
                    processData({ goal: storedGoal, ...storedProfile });
                } else {
                    setLoading(false);
                }
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

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

    if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;

    const radialData = [
        { name: 'Readiness', uv: stats.readiness, fill: '#8884d8' }
    ];

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Welcome back, {userData?.name || 'User'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Target: <strong>{userData?.targetTitle}</strong> | Role: {userData?.role || 'Student'}
                    </p>
                </div>

            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={FaTrophy} title="Readiness Score" value={`${stats.readiness}%`} subtext="Match to Role" color="236, 72, 153" />
                <StatCard icon={FaBookOpen} title="Skills Assessed" value={stats.totalRequired} subtext="Core Competencies" color="99, 102, 241" />
                <StatCard icon={FaUserMd} title="Role Fit" value={stats.readiness > 80 ? 'High' : 'Moderate'} subtext="Based on Gaps" color="6, 182, 212" />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>

                {/* 1. Skill Status Breakdown (Stacked Bar) */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Skill Proficiency Breakdown</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={50} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.1)' }} />
                                <Legend />
                                <Bar dataKey="Good" stackId="a" fill="#22c55e" name="On Track" />
                                <Bar dataKey="Weak" stackId="a" fill="#eab308" name="Needs Improvement" />
                                <Bar dataKey="Missing" stackId="a" fill="#f43f5e" name="Missing Skill" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Competency Radar (User vs Required) */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Competency Gap Map</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="My Level" dataKey="A" stroke="#06b6d4" strokeWidth={3} fill="#06b6d4" fillOpacity={0.4} />
                                <Radar name="Required" dataKey="B" stroke="#ec4899" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                                <Legend />
                                <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* 3. Overall Readiness Radial */}
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div style={{ maxWidth: '400px' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Ready for your Career?</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        You are <strong>{stats.readiness}%</strong> of the way to being job-ready for {userData?.targetTitle}.
                        Focus on the <strong>{stats.missingCount} missing skills</strong> to boost your score efficiently.
                    </p>
                </div>
                <div style={{ width: '250px', height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={20} data={radialData} startAngle={90} endAngle={-270}>
                            <RadialBar
                                minAngle={15}
                                background={{ fill: 'rgba(255,255,255,0.1)' }}
                                clockWise
                                dataKey="uv"
                                cornerRadius={10}
                                fill={stats.readiness > 75 ? '#22c55e' : stats.readiness > 40 ? '#eab308' : '#f43f5e'}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-label" style={{ fill: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                                {stats.readiness}%
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
