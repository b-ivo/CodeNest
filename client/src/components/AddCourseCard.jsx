import { FaPlus } from "react-icons/fa";

const AddCourseCard = ({ onAdd }) => {
  return (
    <div
      onClick={onAdd}
      className="bg-white border-2 border-dashed border-gray-300 hover:border-secondary
                 rounded-2xl h-64 flex flex-col items-center justify-center
                 text-gray-400 hover:text-secondary cursor-pointer transition-all
                 duration-300 hover:bg-gray-50 group card-shadow"
      role="button"
      aria-label="Add new course"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
        <FaPlus className="text-2xl group-hover:text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 group-hover:text-secondary transition-colors mb-2">
        Add New Course
      </h3>
      <p className="text-sm text-gray-500 text-center px-4">
        Create a new course to start your learning journey
      </p>
    </div>
  );
};

export default AddCourseCard;
