import { FaPlus } from "react-icons/fa";

const AddCourseCard = ({ onAdd }) => {
  return (
    <div
      onClick={onAdd}
      className="glass-card border-2 border-dashed border-slate-300 hover:border-primary
                 h-[220px] w-[200px] flex flex-col items-center justify-center
                 text-slate-400 hover:text-primary cursor-pointer transition-all
                 duration-300 hover:bg-slate-50/50 group"
      role="button"
      aria-label="Add new course"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <FaPlus size={24} />
      </div>
      <p className="text-sm font-bold tracking-wide">New Course</p>
    </div>
  );
};

export default AddCourseCard;
