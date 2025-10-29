import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import GradeBook from "./pages/GradeBook";
import MyCourses from "./pages/MyCourse";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/gradebook" element={ <GradeBook /> } />
        <Route path="/courses" element={ <MyCourses /> } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
