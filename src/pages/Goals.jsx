import React, { useState } from 'react';
import { FaHeartbeat, FaLeaf, FaCity, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const navigate = useNavigate();

    const domains = [
        {
            id: 'health',
            title: 'Healthcare Technology',
            description: 'Innovate in medical devices, health informatics, and patient care systems.',
            icon: FaHeartbeat,
            color: '#ec4899' // Pink
        },
        {
            id: 'agri',
            title: 'Agricultural Technology',
            description: 'Transform farming with IoT, precision agriculture, and sustainable food systems.',
            icon: FaLeaf,
            color: '#22c55e' // Green
        },
        {
            id: 'city',
            title: 'Smart City & Urban Systems',
            description: 'Design the future of urban living with intelligent infrastructure and data.',
            icon: FaCity,
            color: '#06b6d4' // Cyan
        }
    ];

    const handleSelect = (id) => {
        setSelectedGoal(id);
    };

    const handleContinue = () => {
        if (selectedGoal) {
            navigate('/assessment');
        }
    };

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '3rem', textAlign: 'center' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Choose Your Path</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Select the emerging sector you want to master.</p>
            </header>

            <div className="grid-cols-auto" style={{ maxWidth: '1000px', margin: '0 auto 3rem auto' }}>
                {domains.map((domain) => (
                    <div
                        key={domain.id}
                        className="glass-panel"
                        onClick={() => handleSelect(domain.id)}
                        style={{
                            padding: '2rem',
                            cursor: 'pointer',
                            position: 'relative',
                            textAlign: 'left',
                            border: selectedGoal === domain.id ? `2px solid ${domain.color}` : '1px solid var(--glass-border)',
                            transform: selectedGoal === domain.id ? 'translateY(-10px)' : 'none', // Simple selection effect
                            transition: 'all 0.3s ease',
                            backgroundColor: selectedGoal === domain.id ? 'rgba(255,255,255,0.08)' : 'var(--bg-card)'
                        }}
                    >
                        {selectedGoal === domain.id && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: domain.color }}>
                                <FaCheckCircle size={24} />
                            </div>
                        )}

                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: `rgba(${parseInt(domain.color.slice(1, 3), 16)}, ${parseInt(domain.color.slice(3, 5), 16)}, ${parseInt(domain.color.slice(5, 7), 16)}, 0.2)`,
                            color: domain.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', marginBottom: '1.5rem'
                        }}>
                            <domain.icon />
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{domain.title}</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{domain.description}</p>
                    </div>
                ))}
            </div>

            <button
                className="glass-button"
                onClick={handleContinue}
                disabled={!selectedGoal}
                style={{
                    fontSize: '1.2rem', padding: '1rem 3rem',
                    background: selectedGoal ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    cursor: selectedGoal ? 'pointer' : 'not-allowed',
                    opacity: selectedGoal ? 1 : 0.5
                }}
            >
                Continue to Assessment
            </button>
        </div>
    );
};

export default Goals;
