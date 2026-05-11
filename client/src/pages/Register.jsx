import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        login(data);
        navigate("/");
      }
      
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Form */}
            <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
                  <p className="text-gray-600">Join CodeNest and start your learning journey</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<FaUser />}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<FaEnvelope />}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<FaLock />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      I am a <span className="text-danger">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          role === "student"
                            ? "border-secondary bg-secondary/5 text-secondary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <FaUserGraduate className="text-2xl mx-auto mb-2" />
                        <div className="font-semibold">Student</div>
                        <div className="text-xs mt-1">Learn and grow</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("teacher")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          role === "teacher"
                            ? "border-secondary bg-secondary/5 text-secondary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <FaChalkboardTeacher className="text-2xl mx-auto mb-2" />
                        <div className="font-semibold">Teacher</div>
                        <div className="text-xs mt-1">Teach and inspire</div>
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      required
                      className="mt-1 rounded border-gray-300 text-secondary focus:ring-secondary" 
                    />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <button type="button" className="text-secondary font-semibold hover:underline">
                        Terms of Service
                      </button>
                      {" "}and{" "}
                      <button type="button" className="text-secondary font-semibold hover:underline">
                        Privacy Policy
                      </button>
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="font-semibold text-secondary hover:text-blue-700 transition-colors">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Panel - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-20 right-20 w-32 h-32 border border-white rounded-full" />
                <div className="absolute bottom-20 left-20 w-24 h-24 border border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full" />
              </div>
              
              <div className="relative z-10 text-white">
                {/* Logo */}
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-bold">C</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">CodeNest</h1>
                    <p className="text-white/80 text-sm">Learning Management System</p>
                  </div>
                </div>
                
                {/* Welcome Message */}
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold leading-tight">
                    Join Thousands of
                    <span className="block text-accent">Successful Learners</span>
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Start your educational journey with our comprehensive platform designed for modern learning.
                  </p>
                </div>

                {/* Benefits */}
                <div className="mt-12 space-y-4">
                  {[
                    "Access to Premium Courses",
                    "Personalized Learning Paths", 
                    "Expert Instructor Support",
                    "Industry-Recognized Certificates"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
