import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaCodeBranch, FaClock, FaStar, FaLightbulb } from 'react-icons/fa';
import AIChatBot from '../components/AIChatBot';
import { db, auth } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { HEALTHCARE_CAREERS, SKILL_RECOMMENDATIONS } from '../utils/skillData';
import { fetchAIRecommendations } from '../services/aiService';
import { completeRecommendation } from '../services/userService';

const Recommendations = () => {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [aiExplanation, setAiExplanation] = useState('');
    const [careerGoal, setCareerGoal] = useState('');
    const [weakSkills, setWeakSkills] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);

    // --- REUSED LOGIC FROM ASSESSMENT (Ideally could be a hook, but keeping simple) ---
    const getLevelValue = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 1;
            case 'intermediate': return 2;
            case 'advanced': return 3;
            default: return 0;
        }
    };

    const generateRecommendations = (career, missingSkills, weakSkills) => {
        const courses = new Set();
        const projects = new Set();
        const learningPath = [];

        // Step 1: Weak skills first (priority)
        weakSkills.forEach(skill => {
            learningPath.push(`Improve ${skill}`);
            if (SKILL_RECOMMENDATIONS[skill]) {
                SKILL_RECOMMENDATIONS[skill].courses.forEach(c => courses.add(c));
                SKILL_RECOMMENDATIONS[skill].projects.forEach(p => projects.add(p));
            }
        });

        // Step 2: Missing skills
        missingSkills.forEach(skill => {
            learningPath.push(`Learn ${skill}`);
            if (SKILL_RECOMMENDATIONS[skill]) {
                SKILL_RECOMMENDATIONS[skill].courses.forEach(c => courses.add(c));
                SKILL_RECOMMENDATIONS[skill].projects.forEach(p => projects.add(p));
            }
        });

        // Step 3: Career-focused project
        learningPath.push(`Build a ${career}-focused healthcare project`);

        return {
            courses: Array.from(courses),
            projects: Array.from(projects),
            learningPath
        };
    };

    const handleComplete = async (item) => {
        if (!confirm(`Mark "${item.title}" as complete? This will update your skill profile.`)) return;

        // Extract skill name from purpose or intelligent guess
        let skillName = "";
        if (item.purpose) {
            skillName = item.purpose.replace('Improve ', '').replace('Learn ', '');
        } else {
            // Fallback: This would ideally be passed from the AI explicitly as a 'skill' field, 
            // but for now we try to map it or default to something generic if unknown.
            // In a real app, we'd ensure the AI response includes "relatedSkill".
            skillName = item.tags?.[0] || "General Healthcare";
        }

        setLoading(true);
        const user = auth.currentUser;
        const success = await completeRecommendation(user, skillName, item.type);

        if (success) {
            // Remove from local list
            setRecommendations(prev => prev.filter(r => r.title !== item.title));
            alert("Great job! Your skills have been updated. Check your Dashboard.");
        } else {
            alert("Failed to update profile. Please try again.");
        }
        setLoading(false);
    };

    const generateAIExplanation = (career, missingSkills, weakSkills) => {
        if (missingSkills.length === 0 && weakSkills.length === 0) {
            return `Excellent work! You are well-prepared for a career in ${career}. Consider exploring advanced specialization projects to stand out further.`;
        }
        return `You have chosen ${career} as your healthcare career goal. To succeed in this field, it is important to strengthen ${weakSkills.join(", ") || "core areas"} first, as these form the foundation. Learning ${missingSkills.join(", ") || "specific technical skills"} next will help you meet professional requirements. Finally, building a ${career}-focused project will allow you to apply your knowledge practically.`;
    };

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const processUser = (userData) => {
            // 2. Identify Target Goal & Skills
            const storedGoal = userData.goal;
            const userSkills = userData.skills || [];

            const DOMAIN_TITLES = {
                'health': 'Healthcare Technology',
                'agri': 'Agricultural Technology',
                'city': 'Smart City & Urban Systems'
            };
            const targetTitle = storedGoal?.specialization || DOMAIN_TITLES[storedGoal?.domain] || 'Healthcare Technology';
            setCareerGoal(targetTitle);

            // 3. Get Required Skills
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
                // Fallback logic for demo if outside mapped careers
                requiredSkills = [{ skill: "Data Analysis", requiredLevel: "Intermediate" }];
            }

            // 4. Calculate Gaps
            let missing = [];
            let weak = [];

            requiredSkills.forEach(req => {
                const userSkill = userSkills.find(s => s.name.toLowerCase() === req.skill.toLowerCase());
                const reqValue = getLevelValue(req.requiredLevel);
                const userValue = userSkill ? getLevelValue(userSkill.level) : 0;

                if (!userSkill) {
                    missing.push(req.skill);
                } else if (userValue < reqValue) {
                    weak.push(req.skill);
                }
            });

            // 5. Generate Recommendations
            setWeakSkills(weak);
            setMissingSkills(missing);

            // ... Recommendation Generation Logic ...
            // We only regenerate AI recommendations if the list CHANGED significantly 
            // to avoid spamming the API on every small update.
            // For now, we allow re-generation to ensure consistency.

            // Try AI first
            (async () => {
                let recData = null;
                let aiText = '';

                try {
                    const aiResult = await fetchAIRecommendations(targetTitle, weak, missing);
                    if (aiResult && aiResult.recommendations) {
                        recData = {
                            courses: aiResult.recommendations.filter(r => r.type === 'course'),
                            projects: aiResult.recommendations.filter(r => r.type === 'project'),
                            fullList: aiResult.recommendations
                        };
                        aiText = aiResult.explanation;
                    }
                } catch (e) {
                    console.log("AI Service unavailable, falling back to local logic");
                }

                // Fallback to local logic
                if (!recData) {
                    const localData = generateRecommendations(targetTitle, missing, weak);
                    recData = localData;
                    aiText = generateAIExplanation(targetTitle, missing, weak);
                }

                setAiExplanation(aiText);

                // 6. Format for UI
                const uiItems = [];
                if (recData.fullList) {
                    recData.fullList.forEach((item, idx) => {
                        uiItems.push({
                            ...item,
                            image: item.image || `https://source.unsplash.com/random/300x200?${item.tags?.[0] || 'technology'},${idx}`
                        });
                    });
                } else {
                    recData.courses.forEach((c, idx) => {
                        uiItems.push({
                            type: 'course',
                            title: c,
                            provider: 'Coursera',
                            duration: '4 Weeks',
                            rating: 4.8,
                            tags: ['Healthcare', 'Skill Building'],
                            image: `https://source.unsplash.com/random/300x200?education,${idx}`
                        });
                    });
                    recData.projects.forEach((p, idx) => {
                        uiItems.push({
                            type: 'project',
                            title: p,
                            provider: 'HAPSIS Projects',
                            duration: '20 Hours',
                            rating: 4.9,
                            tags: ['Practical', 'Portfolio'],
                            image: `https://source.unsplash.com/random/300x200?technology,${idx}`
                        });
                    });
                }

                if (uiItems.length === 0) {
                    uiItems.push({
                        type: 'course',
                        title: "Advanced Healthcare Technology",
                        provider: "FutureLearn",
                        duration: "6 Weeks",
                        rating: 4.7,
                        tags: ["General", "Healthcare"],
                        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=200"
                    });
                }

                setRecommendations(uiItems);
                setLoading(false);
            })();
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (unsubscribeSnapshot) unsubscribeSnapshot();
                const userDocRef = doc(db, "users", user.uid);
                unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        processUser(docSnap.data());
                    }
                });
            } else {
                if (unsubscribeSnapshot) unsubscribeSnapshot();
                const storedGoal = JSON.parse(localStorage.getItem('userGoal'));
                const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
                if (storedGoal && storedProfile) {
                    processUser({ goal: storedGoal, ...storedProfile });
                } else {
                    setLoading(false);
                }

                const handleStorageChange = () => {
                    const updatedProfile = JSON.parse(localStorage.getItem('userProfile'));
                    if (updatedProfile) processUser({ goal: storedGoal, ...updatedProfile });
                };
                window.addEventListener('storage', handleStorageChange);
                return () => window.removeEventListener('storage', handleStorageChange);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    if (loading) return <div className="text-center p-10">Generating Learning Path...</div>;

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Personalized Recommendations</h1>
                <p style={{ color: 'var(--text-muted)' }}>Curated learning paths based on your skill gaps for <strong>{careerGoal}</strong>.</p>
            </header>

            {/* AI Insight Box */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary)', display: 'flex', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--primary)' }}><FaLightbulb /></div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI Insight</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{aiExplanation}</p>
                </div>
            </div>

            <div className="grid-cols-auto">
                {recommendations.map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#333' }}>
                            {/* Using a placeholder service or fallback div if image fails */}
                            <img
                                src={item.image}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#1e293b'; }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                alignSelf: 'start',
                                fontSize: '0.8rem',
                                background: item.type === 'course' ? 'rgba(99,102,241,0.2)' : 'rgba(6,182,212,0.2)',
                                color: item.type === 'course' ? '#a5b4fc' : '#67e8f9',
                                padding: '0.2rem 0.6rem', borderRadius: '4px', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700
                            }}>
                                {item.type}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>by {item.provider}</p>

                            {item.purpose && (
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: '#fff',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '4px',
                                    marginBottom: '1rem',
                                    display: 'inline-block'
                                }}>
                                    🎯 {item.purpose}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaClock /> {item.duration}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaStar style={{ color: '#eab308' }} /> {item.rating}</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'auto' }}>
                                {item.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{tag}</span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(item.searchQuery || (item.title + " " + item.provider + " " + item.type))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button"
                                    style={{ flex: 1, textAlign: 'center', display: 'block', textDecoration: 'none' }}
                                >
                                    {item.type === 'course' ? 'Start Learning' : 'View Project Brief'}
                                </a>
                                <button
                                    onClick={() => handleComplete(item)}
                                    className="glass-button"
                                    style={{ flex: 1, background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                                >
                                    Mark Complete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AIChatBot careerGoal={careerGoal} weakSkills={weakSkills} missingSkills={missingSkills} />
        </div>
    );
};

export default Recommendations;
