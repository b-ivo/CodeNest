import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { 
  FaUpload, 
  FaFile, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaUserGraduate,
  FaClipboardList
} from "react-icons/fa";

export default function ESubmit() {
  const { user, loading } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/student/assignments', {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        // Filter to show only pending assignments
        const pendingAssignments = data.filter(a => !a.isSubmitted && !a.isOverdue);
        setAssignments(pendingAssignments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      fetchAssignments();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) {
      setError("Please select an assignment and provide your submission content.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/assignments/${selectedAssignment._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: submissionText }),
        credentials: 'include'
      });

      if (res.ok) {
        setSuccess("Assignment submitted successfully!");
        setSubmissionText("");
        setSelectedAssignment(null);
        fetchAssignments(); // Refresh the list
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit assignment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect non-students
  if (user?.role !== 'student') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">This page is only available to students.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FaUpload className="text-secondary" />
            Submit Assignment
          </h1>
          <p className="text-gray-600 text-lg">
            Submit your completed assignments for teacher review and grading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignment Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-secondary" />
              Pending Assignments
            </h2>
            
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => {
                  const dueDate = new Date(assignment.dueDate);
                  const isUrgent = (dueDate - new Date()) < 24 * 60 * 60 * 1000;
                  
                  return (
                    <div
                      key={assignment._id}
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedAssignment?._id === assignment._id
                          ? 'border-secondary bg-secondary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {isUrgent ? <FaExclamationTriangle /> : <FaClock />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{assignment.courseId?.courseName}</p>
                          <p className={`text-xs mt-2 font-medium ${
                            isUrgent ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            Due: {dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">All Caught Up!</h3>
                <p className="text-gray-500 text-sm">You have no pending assignments to submit.</p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
            {selectedAssignment ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAssignment.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedAssignment.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Course:</span>
                        <p className="text-gray-600">{selectedAssignment.courseId?.courseName}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Due Date:</span>
                        <p className="text-gray-600">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Max Points:</span>
                        <p className="text-gray-600">{selectedAssignment.maxPoints}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Teacher:</span>
                        <p className="text-gray-600">{selectedAssignment.teacherId?.name}</p>
                      </div>
                    </div>
                  </div>

                  {selectedAssignment.instructions && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.instructions}</p>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Submission <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="w-full h-64 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
                      placeholder="Enter your assignment submission here..."
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                      {success}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssignment(null);
                        setSubmissionText("");
                        setError("");
                        setSuccess("");
                      }}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !submissionText.trim()}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          Submit Assignment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-16">
                <FaFile className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an Assignment</h3>
                <p className="text-gray-500">
                  Choose an assignment from the list on the left to begin your submission.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}