import { FaPlus } from "react-icons/fa";

const AddCourseCard = ({ onAdd }) => {
  return (
    <div
      onClick={onAdd}
      className="bg-white border-2 border-dashed border-blue-400 hover:border-blue-600
                 h-[170px] w-[170px] rounded-xl flex flex-col items-center justify-center
                 text-blue-500 hover:text-blue-700 cursor-pointer transition-all
                 duration-300 shadow-sm hover:shadow-md"
      role="button"
      aria-label="Add new course"
    >
      <FaPlus size={28} />
      <p className="mt-2 text-sm font-semibold">Add New Course</p>
    </div>
  );
};

export default AddCourseCard;
