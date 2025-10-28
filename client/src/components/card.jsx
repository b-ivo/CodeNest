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
      className="relative bg-blue-500 hover:bg-blue-600 h-[170px] w-[170px] rounded-xl
                 p-6 text-white cursor-pointer transition-all duration-300 shadow-md
                 hover:shadow-lg group flex flex-col items-center justify-center text-center"
      role="button"
      aria-label={`Open course ${course.courseName}`}
    >
      {/* small icon */}
      <div className="absolute top-4 left-4 text-white/80">
        {course.icon || <FaBook size={22} />}
      </div>

      <h3 className="text-lg font-semibold z-10">{course.courseName}</h3>
      <p className="font-bold text-xl">Level: {course.classLevel}</p>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                   flex flex-col items-center justify-center rounded-xl
                   transition-opacity duration-300 z-20"
      >
        <p className="text-sm">Category: {course.category}</p>
        <p className="text-xs mt-1">Periods: {course.periods}</p>
      </div>
    </div>
  );
};

export default Card;
