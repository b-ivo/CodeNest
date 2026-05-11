import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBook, FaUsers, FaClock, FaArrowRight } from "react-icons/fa";

const Card = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user?.role === "teacher") {
      navigate(`/teacher/courses/${course._id}`);
    } else {
      navigate(`/courses/${course._id}`);
    }
  };

  // Generate a color scheme based on course name
  const getColorScheme = (courseName) => {
    const colors = [
      { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
      { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
      { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600" },
      { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
      { bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-600" },
      { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600" },
    ];
    const index = courseName.length % colors.length;
    return colors[index];
  };

  const colorScheme = getColorScheme(course.courseName);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 card-shadow
                 hover:shadow-xl border border-gray-100 group relative overflow-hidden h-64"
      role="button"
      aria-label={`Open course ${course.courseName}`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 translate-x-8 -translate-y-8">
        <FaBook className="w-full h-full" />
      </div>
      
      <div className="flex flex-col h-full relative z-10">
        {/* Course Icon */}
        <div className={`w-14 h-14 rounded-2xl ${colorScheme.light} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <FaBook className={`text-xl ${colorScheme.text}`} />
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-secondary transition-colors">
            {course.courseName}
          </h3>
          <p className="text-sm font-medium text-gray-500 mb-4">
            {course.category}
          </p>

          {/* Course Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FaUsers className="text-gray-400" />
              <span>Level {course.classLevel}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FaClock className="text-gray-400" />
              <span>{course.periods} Periods</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className={`px-3 py-1 rounded-full ${colorScheme.light} text-xs font-bold ${colorScheme.text} uppercase tracking-wider`}>
            Active
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
            <FaArrowRight className="text-sm" />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
        <div className={`h-full ${colorScheme.bg} transition-all duration-500 group-hover:w-full`} 
             style={{ width: '65%' }} />
      </div>
    </div>
  );
};

export default Card;
