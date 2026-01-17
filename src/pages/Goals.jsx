import React, { useState } from 'react';
import { FaHeartbeat, FaLeaf, FaCity, FaCheckCircle, FaStethoscope, FaSpa } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Goals = () => {
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const navigate = useNavigate();

    const medicalGroups = {
        modern: [
            'Gynecology & Obstetrics',
            'Orthopedics',
            'Pediatrics',
            'General Medicine',
            'General Surgery',
            'Cardiology',
            'Neurology',
            'Dermatology',
            'Psychiatry',
            'Anesthesiology'
        ],
        ayush: [
            'Ayurveda',
            'Homeopathy',
            'Unani Medicine',
            'Siddha Medicine',
            'Yoga & Naturopathy',
            'Ayurvedic Pharmacy & Herbal Technology',
            'Integrative Medicine (Allopathy + AYUSH)'
        ]
    };

    const handleContinue = async () => {
        if (selectedSpecialization) {
            const goalData = {
                domain: 'health', // Hardcoded as this is now a healthcare app
                specialization: selectedSpecialization
            };

            try {
                const user = auth.currentUser;
                if (user) {
                    await setDoc(doc(db, "users", user.uid), {
                        goal: goalData
                    }, { merge: true });
                    navigate('/assessment');
                } else {
                    localStorage.setItem('userGoal', JSON.stringify(goalData));
                    navigate('/assessment');
                }
            } catch (error) {
                console.error("Error saving goal:", error);
                navigate('/assessment'); // Continue anyway for demo
            }
        }
    };

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '3rem', textAlign: 'center' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Choose Your Medical Path</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Select the specialization you want to master.</p>
            </header>

            {/* Healthcare Specialization Section */}
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto 3rem auto', textAlign: 'left' }}>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Modern Medicine */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontSize: '1.3rem' }}>
                            <FaStethoscope /> Modern Medicine
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {medicalGroups.modern.map((spec) => (
                                <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '8px', background: selectedSpecialization === spec ? 'rgba(236, 72, 153, 0.1)' : 'transparent', border: selectedSpecialization === spec ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid transparent', transition: 'all 0.2s' }}>
                                    <input
                                        type="radio"
                                        name="specialization"
                                        value={spec}
                                        checked={selectedSpecialization === spec}
                                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                                        style={{ accentColor: '#ec4899', width: '1.2rem', height: '1.2rem' }}
                                    />
                                    {spec}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* AYUSH */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '1.3rem' }}>
                            <FaSpa /> AYUSH & Alternative
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {medicalGroups.ayush.map((spec) => (
                                <label key={spec} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '8px', background: selectedSpecialization === spec ? 'rgba(34, 197, 94, 0.1)' : 'transparent', border: selectedSpecialization === spec ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent', transition: 'all 0.2s' }}>
                                    <input
                                        type="radio"
                                        name="specialization"
                                        value={spec}
                                        checked={selectedSpecialization === spec}
                                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                                        style={{ accentColor: '#22c55e', width: '1.2rem', height: '1.2rem' }}
                                    />
                                    {spec}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="glass-button"
                onClick={handleContinue}
                disabled={!selectedSpecialization}
                style={{
                    fontSize: '1.2rem', padding: '1rem 3rem',
                    background: (!selectedSpecialization) ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
                    cursor: (!selectedSpecialization) ? 'not-allowed' : 'pointer',
                    opacity: (!selectedSpecialization) ? 0.5 : 1
                }}
            >
                Start Assessment
            </button>
        </div>
    );
};

export default Goals;
