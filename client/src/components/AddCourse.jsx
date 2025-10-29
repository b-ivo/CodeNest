import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const AddCourse = ({ onClose, onSubmit }) => {
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [periods, setPeriods] = useState("");

  const addCourse = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/addcourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseName, category, classLevel, periods }),
      });

      const data = await res.json();

      if (res.ok) {
        onSubmit(data);
        onClose();
      } else {
        alert(data.message || "Error adding course");
      }
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCourse();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] flex flex-col">
        <h1 className="text-xl font-bold mb-4">Add a new course</h1>

        <label>Course Name</label>
        <Input
          placeholder="Select a name for course"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <label>Select Category</label>
        <Input
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Add level</label>
        <Input
          placeholder="Please put the level 3,4,5"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
        />

        <label>Number of Periods</label>
        <Input
          placeholder="Add number of periods"
          value={periods}
          onChange={(e) => setPeriods(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onClose} className="bg-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Upload</Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
