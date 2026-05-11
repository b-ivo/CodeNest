import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        login(data);
        navigate("/");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Branding */}
            <div className="lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
                <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
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
                    Welcome Back to Your
                    <span className="block text-accent">Learning Journey</span>
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Access your courses, track your progress, and continue building your skills with our comprehensive learning platform.
                  </p>
                </div>

                {/* Features */}
                <div className="mt-12 space-y-4">
                  {[
                    "Interactive Course Management",
                    "Real-time Progress Tracking", 
                    "Collaborative Learning Environment"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your password"
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

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-secondary focus:ring-secondary" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-secondary hover:text-blue-700 transition-colors">
                      Forgot Password?
                    </button>
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
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>

                  {/* Register Link */}
                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/register" className="font-semibold text-secondary hover:text-blue-700 transition-colors">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
