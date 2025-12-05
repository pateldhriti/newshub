import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Newspaper, TrendingUp, Laptop, Users, Sparkles, Twitter, Facebook, Linkedin } from "lucide-react";
import SummarizeModal from "./SummarizeModal";
import { fetchNews } from "../features/news/newsSlice";
import { trackArticleClick } from "../features/recommendation/recommendationSlice";
import { hasValidImage } from "../utils/imageHelpers";

export default function Home() {
  const dispatch = useDispatch();
  const { newsData, loading, error } = useSelector((state) => state.news);
  const { user } = useSelector((state) => state.auth);

  const [isSummarizeModalOpen, setIsSummarizeModalOpen] = useState(false);
  const [articleToSummarize, setArticleToSummarize] = useState(null);

  const handleSummarizeArticle = useCallback((article) => {
    const textToSummarize = `${article.title}\n\n${article.description || ""}`;
    setArticleToSummarize(textToSummarize);
    setIsSummarizeModalOpen(true);
  }, []);

  const handleArticleClick = useCallback((article) => {
    if (user) {
      dispatch(trackArticleClick({
        userId: user.email,
        articleId: article.title, // Using title as ID for now
        articleTitle: article.title,
        section: article.section || article.category || "General"
      }));
    }
  }, [dispatch, user]);

  // Get the first top story for the hero section, or use fallback
  const heroStory = newsData.topStories?.find(hasValidImage) || newsData.topStories?.[0] || {
    title: "Major Breakthrough in AI Could Change the Future of Medicine",
    description: "A new study reveals a groundbreaking AI model that can predict diseases years before symptoms appear, paving the way for preventative healthcare.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
    link: "#",
    source: "Featured"
  };

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col max-w-full w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <main className="flex flex-1 max-w-7xl mx-auto px-6 py-8 w-full gap-8">
          <div className="flex-1">
            <div className="animate-pulse">
              <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl mb-8 shadow-lg"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col max-w-full w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <main className="flex flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white rounded-3xl shadow-xl p-12 border border-blue-100">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-3">
                Unable to Load News
              </h2>
              <p className="text-blue-600 mb-6 text-lg">{error}</p>
              <button
                onClick={() => dispatch(fetchNews())}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-full w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900">
      {/* Main content */}
      <main className="flex flex-1 max-w-7xl mx-auto px-6 py-8 w-full gap-8">
        {/* Left content column */}
        <div className="flex-1">
          {/* Hero Section */}
          <section
            className="relative bg-cover bg-center text-white rounded-3xl overflow-hidden mb-8 shadow-2xl border border-blue-200"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(29, 78, 216, 0.90)), url('${heroStory.image}')`,
            }}
          >
            <div className="p-10 md:p-16">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Featured Story
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                {heroStory.title}
              </h2>
              <p className="mt-3 text-base md:text-lg text-blue-50 max-w-2xl leading-relaxed line-clamp-3">
                {heroStory.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={heroStory.link || heroStory.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleArticleClick(heroStory)}
                  className="bg-white text-blue-700 px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                >
                  Read More
                </a>
                <button
                  onClick={() => handleSummarizeArticle(heroStory)}
                  className="flex items-center gap-2 bg-blue-600/30 backdrop-blur-md border border-white/30 text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-600/50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Summarize
                </button>
              </div>
            </div>
          </section>

          {/* Top Stories */}
          <section className="mb-8">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              Top Stories
            </h3>

            <div className="pr-3">
              <div className="space-y-5">
                {newsData.topStories
                  .filter(hasValidImage)
                  .slice(0, 5)
                  .map((story, idx) => (
                    <article
                      key={idx}
                      className="flex flex-col md:flex-row bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1"
                    >
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full md:w-56 h-48 object-cover flex-shrink-0"
                      />
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {story.category || story.section || "Top Stories"}
                          </div>
                          <h4 className="mt-3 text-xl font-bold leading-tight text-blue-900">
                            <a
                              href={story.link || story.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleArticleClick(story)}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {story.title}
                            </a>
                          </h4>
                          {story.description && (
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                              {story.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              {story.source && (
                                <span className="flex items-center gap-1">
                                  📍 {story.source}
                                </span>
                              )}
                              {story.date && (
                                <span className="flex items-center gap-1">
                                  🕒 {story.date}
                                </span>
                              )}
                            </div>
                            <a
                              href={story.link || story.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => handleArticleClick(story)}
                              className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
                            >
                              Read more →
                            </a>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleSummarizeArticle(story);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                          >
                            <Sparkles className="w-4 h-4" />
                            AI Summarize
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>

            <div className="flex justify-end mt-6 pr-6">
              <button className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 hover:gap-2">
                View All →
              </button>
            </div>
          </section>

          {/* Trending */}
          {newsData.trending.filter(hasValidImage).length > 0 && (
            <section className="mb-8 max-w-[940px]">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Trending
              </h3>

              <div className="overflow-x-auto pb-2 -mx-2 pr-5 pl-3">
                <div className="flex gap-5">
                  {newsData.trending
                    .filter(hasValidImage)
                    .slice(0, 5)
                    .map((item, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-[300px] bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-44 w-full object-cover"
                        />
                        <div className="p-5">
                          <h4 className="font-bold text-blue-900 leading-snug">
                            {item.title}
                          </h4>
                          <div className="mt-4 space-y-2">
                            <button
                              onClick={() => handleArticleClick(item)}
                              className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
                            >
                              Read More →
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSummarizeArticle(item);
                              }}
                              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                            >
                              <Sparkles className="w-4 h-4" />
                              AI Summarize
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end mt-6 pr-6">
                <button className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 hover:gap-2">
                  View All →
                </button>
              </div>
            </section>
          )}

          {/* Politics */}
          {newsData.politics.filter(hasValidImage).length > 0 && (
            <section className="mb-8">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Politics
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {newsData.politics
                  .filter(hasValidImage)
                  .slice(0, 1)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rounded-2xl shadow-lg mb-4 w-full h-56 object-cover"
                      />
                      <h4 className="text-xl font-bold mb-3 text-blue-900">
                        <span
                          className="hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => handleArticleClick(item)}
                        >
                          {item.title}
                        </span>
                      </h4>
                      {item.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSummarizeArticle(item);
                        }}
                        className="mt-4 flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Summarize
                      </button>
                    </div>
                  ))}
                <div className="space-y-4 bg-white rounded-3xl p-6 shadow-md border border-blue-100">
                  {newsData.politics.slice(1, 4).map((item, i) => (
                    <div
                      key={i}
                      className="border-b border-blue-100 pb-4 last:border-0 last:pb-0 font-medium cursor-pointer transition-colors flex items-start justify-between gap-2 group"
                    >
                      <span
                        className="text-blue-900 group-hover:text-blue-600"
                        onClick={() => handleArticleClick(item)}
                      >
                        {item.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSummarizeArticle(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-all flex-shrink-0"
                        title="Summarize with AI"
                      >
                        <Sparkles size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6 pr-6">
                <button className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 hover:gap-2">
                  View All →
                </button>
              </div>
            </section>
          )}

          {/* Technology */}
          {newsData.techArticles.filter(hasValidImage).length > 0 && (
            <section className="mb-8 max-w-[940px]">
              <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Laptop className="w-5 h-5 text-white" />
                </div>
                Technology
              </h3>

              <div className="overflow-x-auto pb-2 -mx-2 pr-5 pl-3">
                <div className="flex space-x-5">
                  {newsData.techArticles
                    .filter(hasValidImage)
                    .slice(0, 5)
                    .map((article, i) => (
                      <div
                        key={i}
                        className="inline-block align-top max-w-[300px] flex-shrink-0 bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 transform hover:-translate-y-1"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-48 w-full object-cover"
                        />
                        <div className="p-5">
                          <h4 className="font-bold text-blue-900 leading-snug">
                            {article.title}
                          </h4>
                          <div className="mt-4 space-y-2">
                            <button
                              onClick={() => handleArticleClick(article)}
                              className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
                            >
                              Read More →
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSummarizeArticle(article);
                              }}
                              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
                            >
                              <Sparkles className="w-4 h-4" />
                              AI Summarize
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end mt-6 pr-6">
                <button className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 hover:gap-2">
                  View All →
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 hidden lg:block border-l-2 border-blue-100 pl-6">
          <div className="sticky top-8">
            <div className="mb-8 bg-white rounded-3xl p-6 shadow-md border border-blue-100">
              <h4 className="text-xl font-bold mb-5 text-blue-900">
                Most Read
              </h4>
              <ul className="space-y-4 text-gray-700">
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  Global Economy Insights
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  AI in Daily Life
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  Renewable Energy Push
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                  New Discoveries in Space
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-100">
              <h5 className="font-bold mb-5 text-blue-900 text-lg">
                Editor's Picks
              </h5>
              <div className="space-y-5">
                <div className="flex gap-3 hover:bg-blue-50 p-2 rounded-2xl transition-colors cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=60"
                    alt="pick"
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="text-blue-600 text-xs uppercase mb-1 font-bold">
                      Environment
                    </div>
                    <div className="font-bold text-sm text-blue-900 leading-snug">
                      The Silent Crisis: How Deforestation is Changing Our
                      Planet
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 hover:bg-blue-50 p-2 rounded-2xl transition-colors cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=60"
                    alt="pick2"
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="text-blue-600 text-xs uppercase mb-1 font-bold">
                      Culture
                    </div>
                    <div className="font-bold text-sm text-blue-900 leading-snug">
                      The Culinary Revolution: A Look Inside the World's Top
                      Kitchens
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-blue-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                  NewsToday
                </span>
              </Link>
              <p className="text-slate-300 leading-relaxed">
                Your trusted source for the latest global news, technology trends,
                and in-depth analysis. Stay informed, stay ahead.
              </p>
              <div className="flex gap-4 pt-2">
                {/* Social Icons */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-200">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "World", path: "/world" },
                  { name: "Technology", path: "/tech" },
                  { name: "Sports", path: "/sports" },
                  { name: "Trending", path: "/trending" }
                ].map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => {
                        if (link.name === "Home") {
                          navigate("/");
                        } else {
                          // Map path to section name for dispatch
                          const sectionMap = {
                            "/world": "World",
                            "/tech": "Technology",
                            "/sports": "Sports",
                            "/trending": "Trending"
                          };
                          dispatch(setSelectedSection(sectionMap[link.path]));
                          navigate(link.path);
                        }
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-slate-300 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-200">
                Subscribe to Newsletter
              </h4>
              <p className="text-slate-300 mb-4">
                Get the latest news and updates delivered directly to your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <div>
              © {new Date().getFullYear()} NewsToday. All rights reserved.
            </div>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
      {/* Summarize Modal */}
      <SummarizeModal
        isOpen={isSummarizeModalOpen}
        onClose={() => {
          setIsSummarizeModalOpen(false);
          setArticleToSummarize(null);
        }}
        initialText={articleToSummarize || ""}
      />
    </div>
  );
}
