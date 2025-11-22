import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { Questionnaire } from './components/Questionnaire';
import { Recommendations } from './components/Recommendations';

export type UserPreferences = {
  interests: string[];
  skillLevel: string;
  timeCommitment: string;
  learningGoal: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'questionnaire' | 'recommendations'>('home');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const dummyPreferences: UserPreferences = {
    interests: ['Web Development', 'Data Science'],
    skillLevel: 'beginner',
    timeCommitment: '5-10',
    learningGoal: 'skill-upgrade',
  };

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setPreferences(dummyPreferences);
    setCurrentPage('recommendations');
  };

  const handleSignup = (name: string, email: string) => {
    setUser({ name, email });
    setPreferences(null);
    setCurrentPage('questionnaire');
  };

  const handleQuestionnaireComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setCurrentPage('recommendations');
  };

  const handleLogout = () => {
    setUser(null);
    setPreferences(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentPage === 'home' && (
        <HomePage onLogin={handleLogin} onSignup={handleSignup} />
      )}
      {currentPage === 'questionnaire' && user && (
        <Questionnaire 
          userName={user.name} 
          onComplete={handleQuestionnaireComplete}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'recommendations' && user && preferences && (
        <Recommendations 
          userName={user.name}
          preferences={preferences}
          onLogout={handleLogout}
          onRetakeQuiz={() => setCurrentPage('questionnaire')}
        />
      )}
    </div>
  );
}
