const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const fetchAIRecommendations = async (careerGoal, weakSkills, missingSkills) => {
    if (!API_KEY) {
        console.warn("API Key is missing or invalid.");
        return null;
    }

    const prompt = `
    Act as an expert career coach and technical mentor. 
    The user is aiming for a career in "${careerGoal}".
    
    Current Skill Gaps:
    - Weak Skills (need improvement): ${weakSkills.join(", ") || "None"}
    - Missing Skills (need to learn): ${missingSkills.join(", ") || "None"}

    Provide a JSON response with two parts:
    1. "explanation": A motivating paragraph explaining why these recommendations are chosen.
    2. "recommendations": An array of 6 specific learning resources (3 courses, 3 projects).

    Each recommendation object must have:
    - type: "course" or "project"
    - title: specific title
    - provider: e.g., Coursera, Udemy, GitHub, etc.
    - duration: estimated time
    - tags: array of short strings (e.g., "Beginner", "Hands-on")
    - rating: number between 4.0 and 5.0
    - purpose: string (e.g., "Improve [Skill Name]" or "Learn [Skill Name]")
    - searchQuery: string (optimized Google search query to find this resource, e.g. "React native crash course YouTube")

    Return ONLY raw JSON, no markdown formatting.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Using Llama 3 70B on Groq for high intelligence
                messages: [
                    { role: "system", content: "You are a helpful assistant that outputs only JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Groq API Error:", err);
            throw new Error(`Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content;

        if (!resultText) throw new Error("No response from AI");

        // Clean markdown if present
        const cleanJson = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("AI Fetch Error:", error);
        return null;
    }
};

export const fetchAIChatResponse = async (history, message, context) => {
    if (!API_KEY) {
        return "Please configure your API Key in aiService.js first.";
    }

    const systemPrompt = `
    You are an expert career mentor helping a user become a "${context.careerGoal || "Professional"}".
    
    Their Skill Profile:
    - Weak Skills (Needs improvement): ${context.weakSkills?.join(", ") || "None"}
    - Missing Skills (Needs learning): ${context.missingSkills?.join(", ") || "None"}
    
    Answer questions about the learning path. Be encouraging, concise (max 3-4 sentences), and professional.
    `;

    // Convert history to OpenAI format
    const messages = [
        { role: "system", content: systemPrompt }
    ];

    history.slice(-6).forEach(msg => {
        messages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        });
    });

    messages.push({ role: "user", content: message });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                stream: false
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Groq Chat API Error:", err);
            return `Error: ${response.statusText}`;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    } catch (error) {
        console.error("AI Chat Error:", error);
        return "Sorry, I am having trouble connecting to Groq AI.";
    }
};
