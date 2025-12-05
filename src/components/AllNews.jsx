import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Newspaper,
  Search,
  Filter,
  Loader,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  fetchAllNews,
  setSearchQuery,
  setSelectedSection,
  fetchSuggestions,
  clearSuggestions,
  incrementSearchFrequency,
} from "../features/news/allNewsSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AllNews() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    hasMore,
    searchQuery,
    selectedSection,
    page,
    suggestions,
    showSuggestions,
  } = useSelector((state) => state.allNews);

  const observerTarget = useRef(null);
  const isLoadingRef = useRef(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);

  // Spell check state
  const [spellCheckSuggestion, setSpellCheckSuggestion] = useState(null);
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const spellCheckTimeoutRef = useRef(null);

  const SECTION_MAP = useMemo(
    () => ({
      news: "Top Stories",
      explore: "MORE TO EXPLORE",
      watch: "MOST WATCHED",
      tech: "Technology",
      politics: "politics",
      trending: "TRENDING",
      sport: "Sport",
      all: "all",
    }),
    []
  );

  // Only update section from URL path, not from dropdown
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path && SECTION_MAP[path]) {
      const mapped = SECTION_MAP[path];
      if (mapped !== selectedSection) {
        console.log("Setting section from URL:", mapped);
        dispatch(setSelectedSection(mapped));
      }
    }
  }, [location.pathname, SECTION_MAP, dispatch]); // Remove selectedSection from deps

  useEffect(() => {
    console.log(
      "Fetching news with section:",
      selectedSection,
      "search:",
      searchQuery
    );
    isLoadingRef.current = true;
    dispatch(
      fetchAllNews({
        page: 1,
        limit: 30,
        search: searchQuery,
        section: selectedSection,
      })
    );
  }, [dispatch, searchQuery, selectedSection]);

  useEffect(() => {
    isLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        dispatch(clearSuggestions());
        setSelectedSuggestionIndex(-1);
        setShowSpellCheck(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  /**
   * Fetch spell check suggestions (called after user stops typing)
   */
  const fetchSpellCheckSuggestions = useCallback(async (text) => {
    if (!text || text.trim().length === 0) {
      setShowSpellCheck(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/spellcheck-suggestions",
        { text: text.trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.has_suggestions) {
        setSpellCheckSuggestion({
          original: response.data.original_text,
          corrected: response.data.corrected_text,
          wrongWords: response.data.wrong_words,
        });
        setShowSpellCheck(true);
      } else {
        setShowSpellCheck(false);
      }
    } catch (error) {
      console.error("Spell check error:", error);
      setShowSpellCheck(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const text = e.target.value;
      dispatch(setSearchQuery(text));
      setSelectedSuggestionIndex(-1);

      if (text.trim() === "") {
        dispatch(clearSuggestions());
        setShowSpellCheck(false);
      } else {
        // Fetch autocomplete suggestions
        dispatch(fetchSuggestions(text));

        // Fetch spell check suggestions after user stops typing (debounce)
        clearTimeout(spellCheckTimeoutRef.current);
        spellCheckTimeoutRef.current = setTimeout(() => {
          fetchSpellCheckSuggestions(text);
        }, 500); // Wait 500ms after user stops typing
      }
    },
    [dispatch, fetchSpellCheckSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      const term =
        typeof suggestion === "string" ? suggestion : suggestion.term;
      dispatch(setSearchQuery(term));
      dispatch(clearSuggestions());
      setSelectedSuggestionIndex(-1);
      setShowSpellCheck(false);
      dispatch(incrementSearchFrequency(term));
    },
    [dispatch]
  );

  /**
   * Handle "Did you mean?" correction click
   */
  const handleSpellCheckCorrection = useCallback(
    (correctedText) => {
      dispatch(setSearchQuery(correctedText));
      setShowSpellCheck(false);
      dispatch(clearSuggestions());
      dispatch(incrementSearchFrequency(correctedText));
    },
    [dispatch]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!showSuggestions || suggestions.length === 0) {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
          dispatch(incrementSearchFrequency(searchQuery.trim()));
          setShowSpellCheck(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            const suggestion = suggestions[selectedSuggestionIndex];
            handleSuggestionClick(suggestion);
          } else if (searchQuery.trim() !== "") {
            dispatch(incrementSearchFrequency(searchQuery.trim()));
            dispatch(clearSuggestions());
            setShowSpellCheck(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          dispatch(clearSuggestions());
          setSelectedSuggestionIndex(-1);
          setShowSpellCheck(false);
          break;
        default:
          break;
      }
    },
    [
      showSuggestions,
      suggestions,
      selectedSuggestionIndex,
      searchQuery,
      handleSuggestionClick,
      dispatch,
    ]
  );

  const handleCategoryChange = useCallback(
    (e) => {
      const value = e.target.value;
      console.log("🔄 Category dropdown changed to:", value);
      dispatch(setSelectedSection(value));
    },
    [dispatch]
  );

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      isLoadingRef.current = true;
      dispatch(
        fetchAllNews({
          page: page - 1,
          limit: 30,
          search: searchQuery,
          section: selectedSection,
        })
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, page, searchQuery, selectedSection]);

  const handleNextPage = useCallback(() => {
    if (hasMore) {
      isLoadingRef.current = true;
      dispatch(
        fetchAllNews({
          page: page + 1,
          limit: 30,
          search: searchQuery,
          section: selectedSection,
        })
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, page, hasMore, searchQuery, selectedSection]);

  const isTopStoriesSection = selectedSection === "Top Stories";

  return (
    <div className="flex flex-col max-w-full w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            {isTopStoriesSection ? (
              <>
                <TrendingUp className="w-10 h-10 text-red-600" />
                Top Stories
              </>
            ) : (
              <>
                <Newspaper className="w-10 h-10 text-blue-600" />
                All News
              </>
            )}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isTopStoriesSection
              ? "Discover the most relevant and trending news articles ranked by importance"
              : `Browse ${selectedSection !== "all" ? selectedSection : "all"
              } news articles with search and filters`}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search Input with Autocomplete and Spell Check */}
          <div className="flex-1 relative" ref={searchInputRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* Unified Autocomplete and Spell Check Dropdown */}
            {(showSuggestions && suggestions.length > 0) || (showSpellCheck && spellCheckSuggestion) ? (
              <ul className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg overflow-y-auto max-h-60 mt-1">
                {/* Spell Check "Did you mean?" as first item */}
                {showSpellCheck && spellCheckSuggestion && (
                  <li
                    onClick={() => handleSpellCheckCorrection(spellCheckSuggestion.corrected)}
                    className="px-4 py-3 cursor-pointer bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Did you mean:
                        </p>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {spellCheckSuggestion.corrected}
                        </span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    </div>
                  </li>
                )}

                {/* Autocomplete Suggestions */}
                {showSuggestions && suggestions.length > 0 && suggestions.slice(0, 4).map((suggestion, index) => {
                  const term =
                    typeof suggestion === "string"
                      ? suggestion
                      : suggestion.term;
                  const frequency =
                    typeof suggestion === "object" ? suggestion.frequency : 0;

                  return (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${selectedSuggestionIndex === index
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-900 dark:text-slate-100">
                          {term}
                        </span>
                      </div>
                      {frequency > 0 && (
                        <div className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                          <span className="font-semibold">{frequency}</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            searches
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Category Filter */}
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedSection}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Sections</option>
              <option value="Top Stories">🔥 Top Stories (Ranked)</option>
              <option value="MORE TO EXPLORE">MORE TO EXPLORE</option>
              <option value="MOST WATCHED">MOST WATCHED</option>
              <option value="Technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="TRENDING">TRENDING</option>
              <option value="Sport">Sport</option>
              <option value="Opinion">Opinion</option>
              <option value="Culture">Culture</option>
            </select>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Top Stories Badge */}
        {isTopStoriesSection && !loading && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <p className="text-red-800 dark:text-red-300 font-medium">
                Showing ranked articles based on relevance and importance
              </p>
            </div>
          </div>
        )}

        {/* Section Info Badge */}
        {!isTopStoriesSection &&
          selectedSection !== "all" &&
          !loading &&
          items.length > 0 && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 dark:text-blue-300 font-medium">
                  Showing articles from: <strong>{selectedSection}</strong>
                </p>
              </div>
            </div>
          )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading state for initial load */}
        {loading && page === 1 && (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-slate-600 dark:text-slate-400">
              Loading news...
            </span>
          </div>
        )}

        {/* News Grid */}
        {!loading || page > 1 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image or Placeholder */}
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                              <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                        <Newspaper className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    {isTopStoriesSection && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        #{(page - 1) * 30 + index + 1}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      {item.section || "News"}
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <a
                        href={item.link || item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.title}
                      </a>
                    </h3>
                    {item.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      {item.source && <span>📍 {item.source}</span>}
                      {item.date && <span>🕒 {item.date}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Loading State for pagination */}
            {loading && page > 1 && (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600 dark:text-slate-400">
                  Loading more news...
                </span>
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                  No news found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {selectedSection !== "all"
                    ? `No articles found in the "${selectedSection}" section. Try selecting a different section.`
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            )}

            {/* No More Items */}
            {!loading && !hasMore && items.length > 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>You've reached the end of the news feed</p>
              </div>
            )}
          </>
        ) : null}

        {/* Pagination Controls */}
        {!loading && items.length > 0 && (
          <div className="flex justify-center items-center gap-4 py-8 mb-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400">Page</span>
              <input
                type="number"
                value={page}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value) || 1;
                  if (newPage > 0) {
                    isLoadingRef.current = true;
                    dispatch(
                      fetchAllNews({
                        page: newPage,
                        limit: 30,
                        search: searchQuery,
                        section: selectedSection,
                      })
                    );
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="w-16 px-2 py-1 text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <span className="text-slate-600 dark:text-slate-400">
                of many
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10" />
      </main>
    </div>
  );
}
