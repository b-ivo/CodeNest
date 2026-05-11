import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { 
  FaBookReader, 
  FaSearch, 
  FaFilter, 
  FaChartLine, 
  FaAward,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaClipboardCheck
} from "react-icons/fa";

export default function GradeBook() {
  const { user, loading } = useAuth();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGrades = async () => {
    try {
      if (user?.role === 'teacher') {
        // Fetch submissions for grading
        const endpoint = selectedCourse ? `/api/teacher/assignments?courseId=${selectedCourse}` : '/api/teacher/assignments';
        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });
        const assignments = await res.json();
        if (res.ok) {
          // Get submissions for each assignment
          const allSubmissions = [];
          for (const assignment of assignments) {
            const submissionRes = await fetch(`/api/assignments/${assignment._id}/submissions`, {
              credentials: "include"
            });
            if (submissionRes.ok) {
              const submissions = await submissionRes.json();
              allSubmissions.push(...submissions.map(sub => ({
                ...sub,
                assignmentTitle: assignment.title,
                courseName: assignment.courseId?.courseName
              })));
            }
          }
          setGrades(allSubmissions);
        }
      } else {
        // Fetch student's grades
        const res = await fetch('/api/student/assignments', {
          method: "GET",
          credentials: "include",
        });
        const assignments = await res.json();
        if (res.ok) {
          const gradedAssignments = assignments.filter(a => a.submission && a.submission.status === 'graded');
          setGrades(gradedAssignments);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const endpoint = user?.role === 'teacher' ? '/api/teacher/courses' : '/api/student/courses';
      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchCourses();
  }, [selectedCourse, user]);

  const filteredGrades = grades.filter(grade => {
    const searchTerm = searchQuery.toLowerCase();
    if (user?.role === 'teacher') {
      return grade.studentId?.name?.toLowerCase().includes(searchTerm) ||
             grade.assignmentTitle?.toLowerCase().includes(searchTerm);
    } else {
      return grade.title?.toLowerCase().includes(searchTerm) ||
             grade.courseId?.courseName?.toLowerCase().includes(searchTerm);
    }
  });

  const getGradeColor = (grade) => {
    const score = user?.role === 'teacher' ? grade.grade : grade.submission?.grade;
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculateStats = () => {
    if (user?.role === 'teacher') {
      const totalSubmissions = grades.length;
      const gradedSubmissions = grades.filter(g => g.status === 'graded').length;
      const avgGrade = grades.filter(g => g.grade).reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.grade).length || 0;
      return { totalSubmissions, gradedSubmissions, avgGrade: avgGrade.toFixed(1) };
    } else {
      const totalGrades = grades.length;
      const avgGrade = grades.reduce((sum, g) => sum + (g.submission?.grade || 0), 0) / totalGrades || 0;
      const highestGrade = Math.max(...grades.map(g => g.submission?.grade || 0));
      return { totalGrades, avgGrade: avgGrade.toFixed(1), highestGrade };
    }
  };

  const stats = calculateStats();

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaBookReader className="text-secondary" />
              {user?.role === 'teacher' ? 'Grade Management' : 'My Gradebook'}
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'teacher' 
                ? 'Review and grade student submissions'
                : 'Track your academic progress and grades'
              }
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {user?.role === 'teacher' ? (
            <>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaClipboardCheck className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalSubmissions}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaAward className="text-green-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Graded</p>
                    <p className="text-2xl font-bold text-green-900">{stats.gradedSubmissions}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaChartLine className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-purple-600">Average Grade</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.avgGrade}%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaBookReader className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Grades</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalGrades}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaChartLine className="text-green-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Average Grade</p>
                    <p className="text-2xl font-bold text-green-900">{stats.avgGrade}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaAward className="text-purple-600 text-xl" />
                  <div>
                    <p className="text-sm font-medium text-purple-600">Highest Grade</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.highestGrade}%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={user?.role === 'teacher' ? "Search students or assignments..." : "Search assignments..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all min-w-48"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
        {filteredGrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {user?.role === 'teacher' ? (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Student</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Assignment</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Course</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Submitted</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Grade</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Assignment</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Course</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Submitted</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Grade</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Feedback</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {user?.role === 'teacher' ? (
                      <>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-sm">
                              {grade.studentId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{grade.studentId?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-900">{grade.assignmentTitle}</td>
                        <td className="py-4 px-6 text-gray-600">{grade.courseName}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(grade.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          {grade.grade ? (
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade)}`}>
                              {grade.grade}%
                            </span>
                          ) : (
                            <span className="text-gray-400">Not graded</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            grade.status === 'graded' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                          }`}>
                            {grade.status}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 font-medium text-gray-900">{grade.title}</td>
                        <td className="py-4 px-6 text-gray-600">{grade.courseId?.courseName}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(grade.submission?.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade)}`}>
                            {grade.submission?.grade}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {grade.submission?.feedback ? (
                            <span className="text-gray-600 truncate max-w-xs block">
                              {grade.submission.feedback}
                            </span>
                          ) : (
                            <span className="text-gray-400">No feedback</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            {user?.role === 'teacher' ? <FaChalkboardTeacher className="text-4xl text-gray-400 mx-auto mb-4" /> : <FaUserGraduate className="text-4xl text-gray-400 mx-auto mb-4" />}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {user?.role === 'teacher' ? 'No Submissions to Grade' : 'No Grades Available'}
            </h3>
            <p className="text-gray-500">
              {user?.role === 'teacher' 
                ? 'Student submissions will appear here once they submit their assignments'
                : 'Your grades will appear here once teachers grade your submissions'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}