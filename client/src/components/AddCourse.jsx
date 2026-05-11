import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const AddCourse = ({ onClose, onSubmit }) => {
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [periods, setPeriods] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName || !category || !classLevel || !periods) {
      alert("Please fill in all fields");
      return;
    }
    onSubmit({ courseName, category, classLevel, periods });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="premium-gradient p-8 text-white">
          <h1 className="text-2xl font-bold">Add New Course</h1>
          <p className="text-white/70 text-sm mt-1">Fill in the details to create a new learning path.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Course Name</label>
            <Input
              placeholder="e.g. Advanced Mathematics"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
              <Input
                placeholder="e.g. Science"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Level</label>
              <Input
                placeholder="e.g. 10"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Number of Periods</label>
            <Input
              placeholder="e.g. 45"
              type="number"
              value={periods}
              onChange={(e) => setPeriods(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" className="px-8 rounded-xl font-bold">
              Create Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
