import { BarChart, BookOpen, Clock, Star } from "lucide-react";
import React from "react";

export type CourseCardProps = {
  course_id: string;
  course_title: string;
  subject: string;
  level: string;
  rating: number;
  num_subscribers: number;
  content_duration: number;
  url: string;
  popularity_weight: number;
};

export default function CourseCard({
  course_id,
  course_title,
  subject,
  level,
  rating,
  num_subscribers,
  content_duration,
  url,
  popularity_weight,
}: CourseCardProps) {
  return (
    <div
      key={course_id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-40 flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-white opacity-80" />
      </div>
      <div className="p-6">
        {/* Match Score Badge */}
        {/* <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full mb-3">
                  {Math.min(100, Math.round( popularity_weight * 100))}% Match
                </div> */}

        <h3 className="text-gray-900 mb-2">{course_title}</h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{subject}</p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            {/* <span>{ rating}</span> */}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{content_duration.toFixed(1)} hrs</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span className="capitalize">{level}</span>
          </div>
        </div>

        <div className="text-gray-600 mb-4">
          {num_subscribers.toLocaleString()} students enrolled
        </div>
        <a
          className="bg-indigo-600 text-white p-5 rounded-lg hover:bg-indigo-700 transition-colors"
          href={url}
          target="_blank"
          style={{ padding: 5 }}
        >
          Go to Course
        </a>
      </div>
    </div>
  );
}
