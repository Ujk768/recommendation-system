import { useState } from 'react';
import { GraduationCap, BookOpen, Target, TrendingUp } from 'lucide-react';
import CourseCard, { CourseCardProps } from './ui/CourseCard';

type HomePageProps = {
  onLogin: (name: string, email: string , password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  loginErrorMessage: string | null;
};

const featuredCourses: CourseCardProps[] = [
  {
    course_id: "feat-1",
    course_title: "Modern Web Development with React & TypeScript",
    subject: "Web Development",
    level: "Beginner",
    rating: 4.8,
    num_subscribers: 125000,
    content_duration: 12,
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    popularity_weight: 0.9,
  },
  {
    course_id: "feat-2",
    course_title: "Cloud Computing on AWS, Azure & GCP",
    subject: "Cloud Computing",
    level: "Intermediate",
    rating: 4.7,
    num_subscribers: 84000,
    content_duration: 10,
    url: "https://www.udemy.com/",
    popularity_weight: 0.85,
  },
  {
    course_id: "feat-3",
    course_title: "Data Science & Machine Learning Bootcamp",
    subject: "Data Science",
    level: "Intermediate",
    rating: 4.9,
    num_subscribers: 192000,
    content_duration: 15,
    url: "https://www.udemy.com/",
    popularity_weight: 0.95,
  },
];

export function HomePage({ onLogin, onSignup, loginErrorMessage }: HomePageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(name || email.split('@')[0], email,password);
    } else {
      onSignup(name, email,password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          <span className="text-indigo-600">Course Recommendation</span>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side - Hero Section */}
        <div className="flex-1 space-y-6">
          <h1 className="text-indigo-900">
            Find Your Perfect Course Match
          </h1>
          <p className="text-gray-600">
            Discover personalized course recommendations based on your interests, goals, and learning style. 
            Our intelligent system helps you find the perfect courses to advance your career and skills.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Personalized Learning</h3>
                <p className="text-gray-600">Get courses tailored to your unique needs and goals</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Goal-Oriented</h3>
                <p className="text-gray-600">Courses aligned with your career objectives</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Industry-Relevant</h3>
                <p className="text-gray-600">Learn in-demand skills for today's job market</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Expert Instructors</h3>
                <p className="text-gray-600">Learn from industry professionals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue your learning journey' : 'Create an account to discover your perfect courses'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  required
                />
                {loginErrorMessage && isLogin && (
                  <p style={{color:"red", fontWeight:500 , padding:2}}>{loginErrorMessage}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Featured courses under the signup / login area */}
      <section className="container mx-auto px-4 py-6 mt-[-30px]">
        <h2 className="text-gray-900 mb-4">
          Featured courses to get you started
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.course_id} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
