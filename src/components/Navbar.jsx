import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSection } from "../features/news/allNewsSlice";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle section navigation
  const handleSectionClick = (section, path) => {
    dispatch(setSelectedSection(section));
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-blue-600">
            <svg
              width="36"
              height="36"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">NewsToday</h1>

          {/* Auth Section - Moved to Left (Removed) */}

          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>

            <button
              onClick={() => handleSectionClick("Top Stories", "/news")}
              className="hover:text-blue-600 transition-colors"
            >
              All News
            </button>

            <button
              onClick={() => handleSectionClick("MORE TO EXPLORE", "/explore")}
              className="hover:text-blue-600 transition-colors"
            >
              World
            </button>

            <button
              onClick={() => handleSectionClick("politics", "/politics")}
              className="hover:text-blue-600 transition-colors"
            >
              Politics
            </button>

            <button
              onClick={() => handleSectionClick("Technology", "/tech")}
              className="hover:text-blue-600 transition-colors"
            >
              Tech
            </button>

            <button
              onClick={() => handleSectionClick("Sport", "/sport")}
              className="hover:text-blue-600 transition-colors"
            >
              Sport
            </button>

            <button
              onClick={() => handleSectionClick("TRENDING", "/trending")}
              className="hover:text-blue-600 transition-colors"
            >
              Trending
            </button>
          </nav>
        </div>

        {/* Auth Section - Moved to Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
