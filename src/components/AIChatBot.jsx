import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { fetchAIChatResponse } from '../services/aiService';

const AIChatBot = ({ careerGoal, weakSkills, missingSkills }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: `Hi! I'm your AI Mentor for ${careerGoal}. Ask me anything about your learning path!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const aiResponseText = await fetchAIChatResponse(
            messages,
            input,
            { careerGoal, weakSkills, missingSkills }
        );

        setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
        setLoading(false);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="animate-bounce"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.5)',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <FaRobot />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '30px',
                    width: '350px',
                    height: '500px',
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        background: 'var(--primary)',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaRobot />
                            <span style={{ fontWeight: 'bold' }}>AI Mentor</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-light)',
                                fontSize: '0.9rem',
                                lineHeight: '1.4'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                AI is typing...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask for advice..."
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                borderRadius: '6px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button onClick={handleSend} style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            width: '40px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatBot;
