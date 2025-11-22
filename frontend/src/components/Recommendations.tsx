import {
  GraduationCap,
  LogOut,
  Clock,
  BarChart,
  Star,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { UserPreferences } from "../App";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

type RecommendationsProps = {
  userName: string;
  preferences: UserPreferences;
  onLogout: () => void;
  onRetakeQuiz: () => void;
};

type Course = {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  description: string;
  matchScore: number;
};

export interface ApiRes {
  course_id: number;
  course_title: string;
  url: string;
  is_paid: boolean;
  price: number;
  num_subscribers: number;
  num_reviews: number;
  num_lectures: number;
  level: string;
  content_duration: number;
  published_timestamp: string; // ISO date string
  subject: string;
  combined_features: string;
  popularity_weight: number;
}

const generateRecommendations = (preferences: UserPreferences): Course[] => {
  const allCourses: Course[] = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      students: 125000,
      duration: "65 hours",
      level: "beginner",
      category: "Web Development",
      description:
        "Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp.",
      matchScore: 98,
    },
    {
      id: "2",
      title: "Advanced React Patterns and Best Practices",
      instructor: "Kent C. Dodds",
      rating: 4.9,
      students: 45000,
      duration: "45 hours",
      level: "advanced",
      category: "Web Development",
      description:
        "Learn advanced React patterns, performance optimization, and modern best practices.",
      matchScore: 95,
    },
    {
      id: "3",
      title: "Python for Data Science and Machine Learning",
      instructor: "Jose Portilla",
      rating: 4.7,
      students: 180000,
      duration: "80 hours",
      level: "beginner",
      category: "Data Science",
      description:
        "Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, and more for data analysis.",
      matchScore: 92,
    },
    {
      id: "4",
      title: "Deep Learning Specialization",
      instructor: "Andrew Ng",
      rating: 4.9,
      students: 95000,
      duration: "120 hours",
      level: "intermediate",
      category: "Machine Learning",
      description:
        "Master neural networks, deep learning, and AI with hands-on projects.",
      matchScore: 94,
    },
    {
      id: "5",
      title: "iOS App Development with Swift",
      instructor: "Angela Yu",
      rating: 4.7,
      students: 67000,
      duration: "55 hours",
      level: "beginner",
      category: "Mobile Development",
      description: "Build iOS apps from scratch using Swift and SwiftUI.",
      matchScore: 89,
    },
    {
      id: "6",
      title: "AWS Certified Solutions Architect",
      instructor: "Stephane Maarek",
      rating: 4.8,
      students: 110000,
      duration: "40 hours",
      level: "intermediate",
      category: "Cloud Computing",
      description:
        "Pass the AWS certification exam and master cloud architecture.",
      matchScore: 91,
    },
    {
      id: "7",
      title: "Complete Ethical Hacking Course",
      instructor: "Zaid Sabih",
      rating: 4.6,
      students: 89000,
      duration: "70 hours",
      level: "intermediate",
      category: "Cybersecurity",
      description:
        "Learn penetration testing, ethical hacking, and cybersecurity fundamentals.",
      matchScore: 88,
    },
    {
      id: "8",
      title: "UI/UX Design Fundamentals",
      instructor: "Daniel Schifano",
      rating: 4.8,
      students: 52000,
      duration: "35 hours",
      level: "beginner",
      category: "UI/UX Design",
      description:
        "Master user interface and user experience design principles.",
      matchScore: 90,
    },
    {
      id: "9",
      title: "DevOps Engineering: CI/CD with Jenkins",
      instructor: "Imran Afzal",
      rating: 4.7,
      students: 43000,
      duration: "50 hours",
      level: "intermediate",
      category: "DevOps",
      description:
        "Master DevOps tools including Jenkins, Docker, Kubernetes, and Git.",
      matchScore: 87,
    },
    {
      id: "10",
      title: "Digital Marketing Masterclass",
      instructor: "Phil Ebiner",
      rating: 4.6,
      students: 78000,
      duration: "45 hours",
      level: "beginner",
      category: "Digital Marketing",
      description:
        "Learn SEO, social media marketing, email marketing, and digital advertising.",
      matchScore: 86,
    },
    {
      id: "11",
      title: "Business Analytics and Data Visualization",
      instructor: "Kirill Eremenko",
      rating: 4.7,
      students: 61000,
      duration: "55 hours",
      level: "intermediate",
      category: "Business Analytics",
      description: "Master Tableau, Power BI, and business intelligence tools.",
      matchScore: 85,
    },
    {
      id: "12",
      title: "Project Management Professional (PMP)",
      instructor: "Andrew Ramdayal",
      rating: 4.8,
      students: 72000,
      duration: "60 hours",
      level: "intermediate",
      category: "Project Management",
      description:
        "Get PMP certified and master project management methodologies.",
      matchScore: 84,
    },
  ];

  // Filter courses based on user preferences
  const filtered = allCourses.filter((course) => {
    // Match interests
    const matchesInterest = preferences.interests.some(
      (interest) =>
        course.category.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(course.category.toLowerCase())
    );

    // Match skill level
    const matchesLevel = course.level === preferences.skillLevel;

    return matchesInterest || matchesLevel;
  });
  // Sort by match score and return top 6
  return filtered.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
};

const generateRecommendationsWithApi = async (data: UserPreferences) => {
  try {
    console.log("preferences data:", data);
    const res = await axios.post("http://127.0.0.1:8000/recommend", {
      inputs: data.interests,
      n: 10,
    });
    console.log("res", res);
    return res.data.recommendations as ApiRes[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export function Recommendations({
  userName,
  preferences,
  onLogout,
  onRetakeQuiz,
}: RecommendationsProps) {
  // const recommendedCourses = generateRecommendations(preferences);

  const [reccomendedFromApi, setReccomendedFromApi] = useState<ApiRes[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recs = await generateRecommendationsWithApi(preferences);
      setReccomendedFromApi(recs);
    };
    fetchRecommendations();
  }, []);

  const recommendedCourses = generateRecommendations(preferences);
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
            <button
              onClick={onRetakeQuiz}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Quiz
            </button>
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

      <div className="container mx-auto px-4 py-12">
        {/* User Preferences Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-gray-900 mb-4">Your Learning Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-indigo-600 mb-1">Interests</div>
              <div className="flex flex-wrap gap-2">
                {preferences.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 mb-1">Skill Level</div>
              <div className="text-gray-900 capitalize">
                {preferences.skillLevel}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 mb-1">Time Commitment</div>
              <div className="text-gray-900">
                {preferences.timeCommitment} hours/week
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 mb-1">Learning Goal</div>
              <div className="text-gray-900 capitalize">
                {preferences.learningGoal.replace("-", " ")}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Your Recommended Courses</h1>
          <p className="text-gray-600">
            Based on your preferences, we've curated {10} courses perfect for
            you
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reccomendedFromApi.map((course) => (
            <div
              key={course.course_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-40 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                {/* Match Score Badge */}
                {/* <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full mb-3">
                  {Math.min(100, Math.round(course.popularity_weight * 100))}% Match
                </div> */}

                <h3 className="text-gray-900 mb-2">{course.course_title}</h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.subject}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {/* <span>{course.rating}</span> */}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.content_duration} hrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    <span className="capitalize">{course.level}</span>
                  </div>
                </div>

                <div className="text-gray-600 mb-4">
                  {course.num_subscribers.toLocaleString()} students enrolled
                </div>
                <a className="bg-indigo-600 text-white p-5 rounded-lg hover:bg-indigo-700 transition-colors" href={course.url} target="_blank" style={{padding:5}}>
                  Go to Course
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
