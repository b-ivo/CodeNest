import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import GradeBook from "./pages/GradeBook";
import MyCourses from "./pages/MyCourse";
import CourseDetails from "./pages/CourseDetails";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Public pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected layout with sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gradebook" element={<GradeBook />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route
            path="/teacher/courses/:courseId"
            element={<CourseDetails />}
          />
        <Route path="*" element={<NotFoundPage />} />
        </Route>

      </Routes>
    </Router>
    </AuthProvider>
  );
}
