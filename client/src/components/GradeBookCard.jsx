import { useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

export default function GradeBookCard({ courseId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (courseId) {
      navigate(`/gradebook?course=${courseId}`);
    } else {
      navigate("/gradebook");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center justify-center text-center"
    >
      <FaBookOpen className="w-10 h-10 text-indigo-500 mb-3" />
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Grade Book
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        View and manage student grades
      </p>
    </div>
  );
}
