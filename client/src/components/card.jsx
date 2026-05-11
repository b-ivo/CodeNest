import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const Card = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teacher/courses/${course._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="glass-card h-[220px] w-[200px] p-6 cursor-pointer transition-all duration-300 
                 hover:-translate-y-2 hover:shadow-2xl border border-white/20 group relative overflow-hidden"
      role="button"
      aria-label={`Open course ${course.courseName}`}
    >
      {/* Decorative Gradient Background */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/40 transition-colors" />
      
      <div className="flex flex-col h-full items-start">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
          {course.icon || <FaBook size={24} />}
        </div>

        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1 group-hover:text-primary transition-colors">
          {course.courseName}
        </h3>
        <p className="text-sm font-medium text-slate-500 mb-auto">
          {course.category}
        </p>

        <div className="mt-4 flex items-center justify-between w-full">
          <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Level {course.classLevel}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {course.periods} Periods
          </span>
        </div>
      </div>

      {/* Progress bar simulation for aesthetic */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
        <div className="h-full bg-accent w-2/3 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
};

export default Card;
