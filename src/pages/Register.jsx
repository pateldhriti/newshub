import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password })).unwrap()
      .then(() => {
        alert("Registration Successful!");
        navigate("/login");
      })
      .catch(() => {
        // Error is handled by Redux state
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="w-[380px] bg-white p-8 rounded-xl shadow-lg border"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {typeof error === 'string' ? error : "Registration failed"}
          </div>
        )}

        <label className="font-medium">Full Name</label>
        <input
          type="text"
          className="border p-2 w-full rounded mb-4"
          placeholder="Dhriti Patel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="font-medium">Email</label>
        <input
          type="email"
          className="border p-2 w-full rounded mb-4"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="font-medium">Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded mb-6"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {status === "loading" ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
