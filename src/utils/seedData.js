import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedUserData = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in first to seed data!");
            return;
        }

        const dummyData = {
            name: user.displayName || "Dr. Alex Morgan",
            email: user.email,
            role: "Medical Resident",
            education: "MBBS",
            skills: [
                { name: "Cardiac Anatomy", level: "Advanced" },
                { name: "Clinical Diagnosis", level: "Intermediate" },
                { name: "ECG Interpretation", level: "Beginner" },
                { name: "Patient Care", level: "Advanced" },
                { name: "Medical Terminology", level: "Advanced" }
            ],
            courses: [
                { name: "Advanced Cardiology", platform: "Coursera" },
                { name: "Medical Ethics", platform: "edX" }
            ],
            projects: [
                { title: "Telemedicine Platform Prototype", description: "Remote consultation tool." },
                { title: "Arrhythmia Detection Study", description: "Research on irregular heartbeats." }
            ],
            goal: {
                domain: "health",
                specialization: "Cardiology"
            },
            updatedAt: new Date()
        };

        await setDoc(doc(db, "users", user.uid), dummyData, { merge: true });
        console.log("Dummy data seeded successfully!");
        alert("Dummy Data Loaded! Redirecting to dashboard...");
        window.location.reload(); // Reload to fetch new data
    } catch (error) {
        console.error("Error seeding data:", error);
        alert("Failed to seed data.");
    }
};
