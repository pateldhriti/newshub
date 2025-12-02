import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedSection } from '../features/news/allNewsSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            <button
              onClick={() => handleSectionClick('Top Stories', '/news')}
              className="hover:text-blue-600 transition-colors"
            >
              All News
            </button>

            <button
              onClick={() => handleSectionClick('MORE TO EXPLORE', '/explore')}
              className="hover:text-blue-600 transition-colors"
            >
              World
            </button>

            <button
              onClick={() => handleSectionClick('politics', '/politics')}
              className="hover:text-blue-600 transition-colors"
            >
              Politics
            </button>

            <button
              onClick={() => handleSectionClick('Technology', '/tech')}
              className="hover:text-blue-600 transition-colors"
            >
              Tech
            </button>

            <button
              onClick={() => handleSectionClick('Sport', '/sport')}
              className="hover:text-blue-600 transition-colors"
            >
              Sport
            </button>

            <button
              onClick={() => handleSectionClick('TRENDING', '/trending')}
              className="hover:text-blue-600 transition-colors"
            >
              Trending
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;