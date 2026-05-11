import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Button from "../components/Button";

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `/api/course/${courseId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <Loader />;
  if (!course)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Course not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto flex flex-col mt-10 items-center justify-center">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        {course.courseName}
      </h1>
      <p>
        <strong>Category:</strong> {course.category}
      </p>
      <p>
        <strong>Level:</strong> {course.classLevel}
      </p>
      <p>
        <strong>Periods:</strong> {course.periods}
      </p>
      <div className="mt-6 w-full flex justify-center">
        <Button onClick={() => navigate(-1)}>Back to Dashboard</Button>
      </div>
    </div>
  );
}
