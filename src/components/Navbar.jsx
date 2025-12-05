import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSection } from "../features/news/allNewsSlice";
import { logout } from "../features/auth/authSlice";
import { User, LogOut, Moon, Sun } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  // Handle section navigation
  const handleSectionClick = (section, path) => {
    dispatch(setSelectedSection(section));
    navigate(path);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white shadow-sm">
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
          <h1 className="text-xl font-bold text-gray-900">NewsToday</h1>

          {/* Auth Section - Moved to Left (Removed) */}

          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm text-gray-700">
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

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-gray-700" />
          )}
        </button>

        {/* Auth Section - Moved to Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="User menu"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fadeIn z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User size={18} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
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
