import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Sparkles,
    Loader,
    Newspaper,
    TrendingUp,
    Lock,
} from "lucide-react";
import { fetchRecommendations } from "../features/recommendation/recommendationSlice";
import { hasValidImage } from "../utils/imageHelpers";

export default function Recommendations() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { items, loading, error } = useSelector((state) => state.recommendations);

    useEffect(() => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate("/");
            return;
        }

        // Fetch recommendations for logged-in user
        dispatch(fetchRecommendations({ userId: user.email, limit: 20 }));
    }, [dispatch, user, navigate]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 px-6">
                <Lock className="w-16 h-16 text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Login Required
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Please login to see personalized recommendations
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-full w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <Sparkles className="w-10 h-10 text-purple-600" />
                        For You
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Personalized news recommendations based on your reading history
                    </p>
                </div>

                {/* AI Badge */}
                <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <p className="text-purple-800 dark:text-purple-300 font-medium">
                            AI-powered recommendations tailored to your interests
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader className="w-8 h-8 animate-spin text-purple-600" />
                        <span className="ml-3 text-slate-600 dark:text-slate-400">
                            Generating recommendations...
                        </span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && items.length === 0 && !error && (
                    <div className="text-center py-16">
                        <Newspaper className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No recommendations yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Start reading articles to get personalized recommendations
                        </p>
                        <button
                            onClick={() => navigate("/news")}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse News
                        </button>
                    </div>
                )}

                {/* Recommendations Grid */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, index) => (
                            <article
                                key={`${item.title}-${index}`}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative">
                                    {(item.image || item.imageLink || item.img || item.urlToImage) ? (
                                        <img
                                            src={item.image || item.imageLink || item.img || item.urlToImage}
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
                                    {/* AI Badge on image */}
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        AI Pick
                                    </div>
                                </div>

                                {/* Content */}
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

                                    {/* Metadata */}
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        {item.source && <span>📍 {item.source}</span>}
                                        {item.date && <span>🕒 {item.date}</span>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
