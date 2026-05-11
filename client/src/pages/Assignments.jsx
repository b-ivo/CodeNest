import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { 
  FaClipboardList, 
  FaPlus, 
  FaSearch, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate
} from "react-icons/fa";

export default function Assignments() {
  const { user, loading } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const endpoint = user?.role === 'teacher' ? '/api/teacher/assignments' : '/api/student/assignments';
      const url = selectedCourse ? `${endpoint}?courseId=${selectedCourse}` : endpoint;
      
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setAssignments(data);
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
    fetchAssignments();
    fetchCourses();
  }, [selectedCourse, user]);

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseId?.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (assignment) => {
    if (user?.role === 'teacher') {
      return assignment.status === 'published' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';
    } else {
      if (assignment.isSubmitted) return 'text-green-600 bg-green-50';
      if (assignment.isOverdue) return 'text-red-600 bg-red-50';
      return 'text-orange-600 bg-orange-50';
    }
  };

  const getStatusText = (assignment) => {
    if (user?.role === 'teacher') {
      return assignment.status === 'published' ? 'Published' : 'Draft';
    } else {
      if (assignment.isSubmitted) return 'Submitted';
      if (assignment.isOverdue) return 'Overdue';
      return 'Pending';
    }
  };

  const getStatusIcon = (assignment) => {
    if (user?.role === 'teacher') {
      return assignment.status === 'published' ? <FaCheckCircle /> : <FaClock />;
    } else {
      if (assignment.isSubmitted) return <FaCheckCircle />;
      if (assignment.isOverdue) return <FaExclamationTriangle />;
      return <FaClock />;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaClipboardList className="text-secondary" />
              {user?.role === 'teacher' ? 'Assignment Management' : 'My Assignments'}
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'teacher' 
                ? 'Create, manage, and grade student assignments'
                : 'View and submit your course assignments'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'teacher' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FaPlus />
                Create Assignment
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
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

      {/* Assignments List */}
      <div>
        {filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isUrgent = user?.role === 'student' && (dueDate - new Date()) < 24 * 60 * 60 * 1000;
              
              return (
                <div key={assignment._id} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          user?.role === 'teacher' ? 'bg-blue-50 text-blue-600' : 
                          assignment.isSubmitted ? 'bg-green-50 text-green-600' :
                          assignment.isOverdue ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {getStatusIcon(assignment)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 hover:text-secondary transition-colors cursor-pointer"
                                onClick={() => navigate(`/assignments/${assignment._id}`)}>
                              {assignment.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(assignment)}`}>
                              {getStatusText(assignment)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <FaUserGraduate />
                              <span>{assignment.courseId?.courseName}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FaClock />
                              <span className={isUrgent ? 'text-red-600 font-semibold' : ''}>
                                Due: {dueDate.toLocaleDateString()}
                              </span>
                            </div>
                            
                            {user?.role === 'teacher' && (
                              <div className="flex items-center gap-2">
                                <FaUsers />
                                <span>{assignment.submissionCount || 0} submissions</span>
                              </div>
                            )}
                            
                            {assignment.maxPoints && (
                              <div className="flex items-center gap-2">
                                <span>Max: {assignment.maxPoints} pts</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {user?.role === 'teacher' ? (
                        <>
                          <button
                            onClick={() => navigate(`/assignments/${assignment._id}/edit`)}
                            className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-50 transition-colors"
                            title="Edit Assignment"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => navigate(`/assignments/${assignment._id}`)}
                            className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-gray-50 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/assignments/${assignment._id}`)}
                          className="btn-secondary text-sm"
                        >
                          {assignment.isSubmitted ? 'View Submission' : 'Submit Work'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            {user?.role === 'teacher' ? <FaChalkboardTeacher className="text-4xl text-gray-400 mx-auto mb-4" /> : <FaUserGraduate className="text-4xl text-gray-400 mx-auto mb-4" />}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {user?.role === 'teacher' ? 'No Assignments Created' : 'No Assignments Available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {user?.role === 'teacher' 
                ? 'Create your first assignment to engage students with coursework'
                : 'Check back later for new assignments from your instructors'
              }
            </p>
            {user?.role === 'teacher' && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Create Your First Assignment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Assignment Modal - Only for Teachers */}
      {showCreateForm && user?.role === 'teacher' && (
        <CreateAssignmentModal 
          courses={courses}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchAssignments();
          }}
        />
      )}
    </div>
  );
}

// Create Assignment Modal Component
function CreateAssignmentModal({ courses, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxPoints: 100,
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create assignment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field h-24 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Points</label>
              <input
                type="number"
                value={formData.maxPoints}
                onChange={(e) => setFormData({...formData, maxPoints: parseInt(e.target.value)})}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions (Optional)</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              className="input-field h-32 resize-none"
              placeholder="Additional instructions for students..."
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}