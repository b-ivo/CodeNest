import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        navigate("/");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-dvw h-screen bg-blue-200 flex items-center justify-center">
      <div className="h-4/5 w-4/5 flex">
        {/* Left side */}
        <div className="w-1/2 bg-[#161550] border-3 border-white flex items-center justify-center rounded-l-3xl">
          <div className="flex flex-col text-white mx-12">
            <h1 className="font-extrabold text-5xl my-4">Join Codenest</h1>
            <p className="font-medium text-3xl">
              Enter your personal details and start your journey with us
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-r-3xl border-3 border-white">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-blue-950 font-medium text-4xl mb-4">Sign Up</h1>

            <Input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-600 mt-2 text-sm font-medium">{error}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Signup"}
            </Button>

            <p className="text-blue-950 mt-4">
              Already have an account{" "}
              <Link
                to="/login"
                className="text-blue-700 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
