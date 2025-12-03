import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !value.includes("@")) {
      const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
      setSuggestions(domains.map((domain) => `${value}@${domain}`));
    } else {
      setSuggestions([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        // Error is handled by Redux state
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-md rounded-xl border w-[350px]"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {typeof error === 'string' ? error : "Login failed"}
          </div>
        )}

        <label>Email</label>
        <input
          type="email"
          className="border p-2 w-full rounded mb-4"
          placeholder="example@mail.com"
          value={email}
          onChange={handleEmailChange}
          list="email-suggestions"
          required
        />
        <datalist id="email-suggestions">
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>

        <label>Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded mb-6"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
