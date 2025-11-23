import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { Questionnaire } from "./components/Questionnaire";
import { Recommendations } from "./components/Recommendations";
import axios from "axios";

export type UserPreferences = {
  interests: string[];
  skillLevel: string;
  timeCommitment: string;
  learningGoal: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "questionnaire" | "recommendations"
  >("home");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const dummyPreferences: UserPreferences = {
    interests: ["Web Development", "Data Science"],
    skillLevel: "beginner",
    timeCommitment: "5-10",
    learningGoal: "skill-upgrade",
  };

  const getUserInfo = async (email: string) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
      });
      console.log("Fetched user info:", res.data);
      return res.data.preferences;
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const handleLogin = async (name: string, email: string, password: string) => {
    setUser({ name, email, password });
    const prefs = await getUserInfo(email);
    if (prefs) {
      setPreferences(prefs);
      setCurrentPage("recommendations");
    } else {
      setLoginError("No account found with this email. Please sign up.");
    }
  };

  const handleSignup = (name: string, email: string, password: string) => {
    setUser({ name, email, password });
    setPreferences(null);
    setCurrentPage("questionnaire");
  };

  const saveUserInfoToDB = async (
    email: string,
    password: string,
    prefs: UserPreferences
  ) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/signup", {
        email: email,
        password: password,
        interests: prefs.interests,
        skillLevel: prefs.skillLevel,
        timeCommitment: prefs.timeCommitment,
        learningGoal: prefs.learningGoal,
      });
      console.log("User info saved:", res.data);
    } catch (err) {
      console.error("Error saving user info:", err);
    }
  };

  const handleQuestionnaireComplete = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    await saveUserInfoToDB(user?.email || "", user?.password || "", prefs);
    setCurrentPage("recommendations");
  };

  const handleLogout = () => {
    setUser(null);
    setPreferences(null);
    setCurrentPage("home");
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentPage === "home" && (
        <HomePage onLogin={handleLogin} onSignup={handleSignup} loginErrorMessage ={loginError ?? null} />
      )}
      {currentPage === "questionnaire" && user && (
        <Questionnaire
          userName={user.name}
          onComplete={handleQuestionnaireComplete}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "recommendations" && user && preferences && (
        <Recommendations
          userName={user.name}
          preferences={preferences}
          onLogout={handleLogout}
          onRetakeQuiz={() => setCurrentPage("questionnaire")}
        />
      )}
    </div>
  );
}
