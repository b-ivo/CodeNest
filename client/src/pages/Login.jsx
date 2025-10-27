import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { InlineLoader } from "../components/inLineLoader";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
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
    <div
      className="w-dvw h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('../public/bg.jpg'" }}
    >
      <div className="h-4/5 w-4/5 flex">
        {/* Left side */}
        <div className="w-1/2 bg-[#161550] border-3 border-white flex items-center justify-center rounded-l-3xl">
          <div className="flex flex-col">
            <h1 className="text-white font-extrabold text-5xl mx-12 my-4">
              Welcome to CodeNest
            </h1>
            <p className="text-white font-medium text-3xl mx-12">
              To keep connected with us login with your personal info
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-r-3xl border-3 border-white">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <h1 className="text-blue-950 font-medium text-4xl mb-4">Login</h1>

            <Input
              placeholder="Email"
              type="text"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              name="password "
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-600 mt-2 text-sm font-medium">{error}</p>
            )}

            <div className="flex flex-row justify-between w-3/4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="text-blue-950 mr-2 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-blue-950 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="cursor-pointer text-blue-950 hover:underline"
              >
                Forgot password
              </button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? <InlineLoader /> : "Login"}
            </Button>

            <p className="text-blue-950 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-700 font-semibold hover:underline"
              >
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
