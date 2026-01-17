import React, { useState } from 'react';
import { FaUser, FaCode, FaBriefcase, FaPlus, FaTimes } from 'react-icons/fa';

const Profile = () => {
    const [skills, setSkills] = useState(['React', 'Data Analysis', 'Urban Planning']);
    const [newSkill, setNewSkill] = useState('');

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="container-custom animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem' }}>My Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your academic and professional identity.</p>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'var(--gradient-main)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        fontSize: '3rem', color: 'white'
                    }}>
                        <FaUser />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem' }}>Alex Morgan</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Student • Computer Science & Urban Systems</p>
                        <button className="glass-button" style={{ marginTop: '1rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Change Avatar</button>
                    </div>
                </div>

                <form style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                            <input type="text" className="glass-input" defaultValue="Alex Morgan" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                            <input type="email" className="glass-input" defaultValue="alex.m@university.edu" />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Bio</label>
                        <textarea className="glass-input" rows="3" defaultValue="Passionate about leveraging technology for sustainable urban development."></textarea>
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCode style={{ color: 'var(--primary)' }} /> Skills & Competencies
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {skills.map(skill => (
                        <span key={skill} style={{
                            background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc',
                            padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                            {skill}
                            <button
                                onClick={() => removeSkill(skill)}
                                style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', display: 'flex' }}
                            >
                                <FaTimes size={12} />
                            </button>
                        </span>
                    ))}
                </div>

                <form onSubmit={addSkill} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="Add a new skill (e.g. Machine Learning)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button type="submit" className="glass-button" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
                        <FaPlus />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
