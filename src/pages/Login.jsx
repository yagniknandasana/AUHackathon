import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, auth logic here
        navigate('/dashboard');
    };

    const InputField = ({ type, placeholder, icon: Icon }) => (
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Icon />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                className="glass-input"
                style={{ paddingLeft: '3rem' }}
                required
            />
        </div>
    );

    return (
        <div className="flex-center" style={{ minHeight: 'calc(100vh - 100px)' }}> {/* Adjust for navbar if visible, or hide nav on login */}
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isSignup ? 'Start your skill intelligence journey' : 'Access your dashboard'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {isSignup && <InputField type="text" placeholder="Full Name" icon={FaUser} />}
                    <InputField type="email" placeholder="Email Address" icon={FaEnvelope} />
                    <InputField type="password" placeholder="Password" icon={FaLock} />

                    <button
                        type="submit"
                        className="glass-button"
                        style={{ width: '100%', marginTop: '1rem', background: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                        {isSignup ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>OR CONTINUE WITH</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button className="glass-button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <FaGoogle /> Google
                    </button>
                    <button className="glass-button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        <FaLinkedin /> LinkedIn
                    </button>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
