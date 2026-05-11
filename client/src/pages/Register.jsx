import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { InlineLoader } from "../components/inLineLoader";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ name, email, password }),
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
    <div
      className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at 100% 100%, rgba(22, 21, 80, 1) 0%, rgba(15, 23, 42, 1) 100%)",
      }}
    >
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="max-w-5xl w-full flex flex-col md:flex-row h-[600px] shadow-2xl rounded-3xl overflow-hidden glass-card border-white/10">
        {/* Left side - Branding/Welcome */}
        <div className="hidden md:flex md:w-1/2 premium-gradient p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white/20" />
          </div>
          
          <div className="z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary font-bold text-xl">C</div>
              <span className="text-2xl font-bold tracking-tight text-white">CodeNest</span>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Start Your <br />
              <span className="text-accent">Journey</span> <br />
              With Us.
            </h1>
            <p className="text-white/70 text-xl font-medium max-w-sm">
              Create an account and join a community of learners and educators building the future together.
            </p>
          </div>

          <div className="z-10 text-white/40 text-sm">
            © 2026 CodeNest Platform. All rights reserved.
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-8">Sign up to get started with CodeNest</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <Input
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <Input
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-lg font-bold mt-4">
                {loading ? <InlineLoader /> : "Create Account"}
              </Button>

              <p className="text-center text-slate-600 text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
