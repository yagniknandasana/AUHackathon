import React from 'react';
import { FaPlayCircle, FaCodeBranch, FaClock, FaStar } from 'react-icons/fa';

const Recommendations = () => {
    const recommendations = [
        {
            type: 'course',
            title: 'Advanced Data Science for Urban Planning',
            provider: 'Coursera',
            duration: '4 Weeks',
            rating: 4.8,
            tags: ['Data Analysis', 'Python', 'Smart Cities'],
            image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=300&h=200'
        },
        {
            type: 'project',
            title: 'Build a Traffic Congestion Predictor',
            provider: 'HAPSIS Projects',
            duration: '20 Hours',
            rating: 4.9,
            tags: ['Machine Learning', 'Real-world Data'],
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=300&h=200'
        },
        {
            type: 'course',
            title: 'IoT Sensor Networks Deployment',
            provider: 'Udemy',
            duration: '12 Hours',
            rating: 4.6,
            tags: ['IoT', 'Hardware', 'Networking'],
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300&h=200'
        }
    ];

    return (
        <div className="container-custom animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Personalized Recommendations</h1>
                <p style={{ color: 'var(--text-muted)' }}>Curated learning paths based on your skill gaps in <strong>Python/R</strong>.</p>
            </header>

            <div className="grid-cols-auto">
                {recommendations.map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '160px', overflow: 'hidden' }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
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

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaClock /> {item.duration}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaStar style={{ color: '#eab308' }} /> {item.rating}</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'auto' }}>
                                {item.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{tag}</span>
                                ))}
                            </div>

                            <button className="glass-button" style={{ marginTop: '1.5rem', width: '100%' }}>
                                {item.type === 'course' ? 'Start Learning' : 'View Project Brief'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
