# HAPSIS - Holistic Academic and Professional Skill Intelligence System 🏥

## Project Overview
**HAPSIS** is an intelligent web application designed to empower healthcare students and professionals. It provides a holistic platform to assess skills, identify gaps, and receive personalized learning recommendations. The system currently focuses on **Healthcare**, offering specialized paths for Modern Medicine and AYUSH.

### Key Features
*   **🩺 Deep Healthcare Focus**: Specialized career paths for Cardiology, Neurology, Pediatrics, AYUSH, and more.
*   **🧠 Intelligent Skill Assessment**: Analyzes your skill profile against industry standards to identify "Missing" and "Weak" areas.
*   **⚡ Dual-Track Recommendations**:
    *   **Gap Filling**: Suggests courses to fix weaknesses.
    *   **Mastery Building**: Suggests advanced projects for your strengths.
*   **📊 Clinical Competency Dashboard**: Visualizes your progress in Clinical Skills, Anatomy, Pharma, and Ethics.
*   **🤖 AI Insights**: Provides contextual explanations for your personalized learning path.
*   **� AI Chatbot**: Interactive **AI Mentor** to answer your career questions in real-time.
*   **�🔐 Secure Authentication**: Integrated with Firebase for secure email/password and Google login.

## Tech Stack
*   **Frontend**: React.js (Vite)
*   **Language**: JavaScript (ES6+)
*   **Styling**: Vanilla CSS (Glassmorphism Design System), Responsive Layouts
*   **Routing**: React Router DOM v6
*   **State/Backend**: Firebase v9 (Authentication, Firestore Database)
*   **Visualization**: Recharts (for data visualization)
*   **Icons**: React Icons (Fa)

## Setup Steps & How to Run Locally

### Prerequisites
*   Node.js (v14 or higher)
*   npm (v6 or higher)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yagniknandasana/Team-GRAYT-Code.git
    cd Team-GRAYT-Code
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will start at `http://localhost:5173`.

## Environment Variables & Configuration
This project uses **Firebase** for backend services. You must configure your own Firebase project.

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Authentication** (Email/Password and Google Provider).
4.  Enable **Firestore Database** (Start in Test Mode for development).
5.  Get your web app configuration object.
6.  Open `src/firebase.js` and replace the `firebaseConfig` object with yours:

```javascript
// src/firebase.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

> **Note**: For the AI features to work, you will also need to configure the `src/services/aiService.js` with your specific API key or environment variable.

## Error Handling
*   **Blank Screen?**: Check the console (`F12`) for errors. Ensure your Firebase config is valid.
*   **Permission Denied?**: Ensure your Firestore Security Rules allow read/write (for development mode).
*   **AI Not Responding?**: Verify your API key in `aiService.js`.

## 🛡️ Security Note
**No secrets are committed in this repository.** The `firebaseConfig` contains public identifiers. Ensure you enable **Firebase Security Rules** and **App Check** before deploying to production.
