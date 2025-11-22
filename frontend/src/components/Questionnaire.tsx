import { useState } from 'react';
import { GraduationCap, CheckCircle2, LogOut } from 'lucide-react';
import { UserPreferences } from '../App';

type QuestionnaireProps = {
  userName: string;
  onComplete: (preferences: UserPreferences) => void;
  onLogout: () => void;
};

const interestOptions = [
  'Web Development',
  'Marketing',
  'Data Science',
  'Finance',
  'Forex',
  'Graphic Design',
  'Musical Instruments',
  'Java',
  'Python',
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to the field' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Extensive experience' },
];

const timeCommitments = [
  { value: '5-10', label: '5-10 hours/week', description: 'Light commitment' },
  { value: '10-20', label: '10-20 hours/week', description: 'Moderate commitment' },
  { value: '20+', label: '20+ hours/week', description: 'Full-time learning' },
];

const learningGoals = [
  { value: 'career-change', label: 'Career Change', description: 'Switch to a new field' },
  { value: 'skill-upgrade', label: 'Skill Upgrade', description: 'Enhance current skills' },
  { value: 'hobby', label: 'Personal Interest', description: 'Learn for fun' },
  { value: 'certification', label: 'Certification', description: 'Get certified' },
];

export function Questionnaire({ userName, onComplete, onLogout }: QuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [learningGoal, setLearningGoal] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        interests: selectedInterests,
        skillLevel,
        timeCommitment,
        learningGoal,
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedInterests.length > 0;
      case 2:
        return skillLevel !== '';
      case 3:
        return timeCommitment !== '';
      case 4:
        return learningGoal !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <span className="text-indigo-600">CourseMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {userName}!</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Step {step} of 4</span>
            <span className="text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {step === 1 && (
            <div>
              <h2 className="text-gray-900 mb-2">What are you interested in learning?</h2>
              <p className="text-gray-600 mb-6">Select all topics that interest you</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedInterests.includes(interest)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{interest}</span>
                      {selectedInterests.includes(interest) && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-gray-900 mb-2">What's your current skill level?</h2>
              <p className="text-gray-600 mb-6">This helps us recommend the right courses</p>
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSkillLevel(level.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      skillLevel === level.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 mb-1">{level.label}</div>
                        <div className="text-gray-600">{level.description}</div>
                      </div>
                      {skillLevel === level.value && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-gray-900 mb-2">How much time can you commit?</h2>
              <p className="text-gray-600 mb-6">Choose your weekly learning commitment</p>
              <div className="space-y-3">
                {timeCommitments.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setTimeCommitment(time.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      timeCommitment === time.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 mb-1">{time.label}</div>
                        <div className="text-gray-600">{time.description}</div>
                      </div>
                      {timeCommitment === time.value && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-gray-900 mb-2">What's your learning goal?</h2>
              <p className="text-gray-600 mb-6">Tell us what you want to achieve</p>
              <div className="space-y-3">
                {learningGoals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setLearningGoal(goal.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      learningGoal === goal.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 mb-1">{goal.label}</div>
                        <div className="text-gray-600">{goal.description}</div>
                      </div>
                      {learningGoal === goal.value && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {step === 4 ? 'Get Recommendations' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
