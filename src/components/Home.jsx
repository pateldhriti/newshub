import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Newspaper, TrendingUp, Laptop, Users } from 'lucide-react';
import { fetchNews } from '../features/news/newsSlice';
import { hasValidImage } from '../utils/imageHelpers';

export default function Home() {
  const dispatch = useDispatch();
  const { newsData, loading, error } = useSelector((state) => state.news);

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
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-gradient-to-r from-blue-50 to-white rounded-3xl shadow-md"></div>
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
              backgroundImage:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(29, 78, 216, 0.90)), url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="p-10 md:p-16">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Featured Story
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Major Breakthrough in AI Could Change the Future of Medicine
              </h2>
              <p className="mt-3 text-base md:text-lg text-blue-50 max-w-2xl leading-relaxed">
                A new study reveals a groundbreaking AI model that can predict
                diseases years before symptoms appear, paving the way for
                preventative healthcare.
              </p>
              <button className="mt-8 bg-white text-blue-700 px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Read More
              </button>
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
                {newsData.topStories.filter(hasValidImage).slice(0, 5).map((story, idx) => (
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
                          {story.category || story.section || 'Top Stories'}
                        </div>
                        <h4 className="mt-3 text-xl font-bold leading-tight text-blue-900">
                          <a
                            href={story.link || story.url}
                            target="_blank"
                            rel="noreferrer"
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

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          {story.source && <span className="flex items-center gap-1">📍 {story.source}</span>}
                          {story.date && <span className="flex items-center gap-1">🕒 {story.date}</span>}
                        </div>
                        <a
                          href={story.link || story.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          Read more →
                        </a>
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
                  {newsData.trending.filter(hasValidImage).slice(0, 5).map((item, i) => (
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
                        <h4 className="font-bold text-blue-900 leading-snug">{item.title}</h4>
                        <button className="mt-4 text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1">
                          Read More →
                        </button>
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
                {newsData.politics.filter(hasValidImage).slice(0, 1).map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-md border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-2xl shadow-lg mb-4 w-full h-56 object-cover"
                    />
                    <h4 className="text-xl font-bold mb-3 text-blue-900">{item.title}</h4>
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
                <div className="space-y-4 bg-white rounded-3xl p-6 shadow-md border border-blue-100">
                  {newsData.politics.slice(1, 4).map((item, i) => (
                    <div key={i} className="border-b border-blue-100 pb-4 last:border-0 last:pb-0 text-blue-900 font-medium hover:text-blue-600 cursor-pointer transition-colors">
                      {item.title}
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
                  {newsData.techArticles.filter(hasValidImage).slice(0, 5).map((article, i) => (
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
                        <button className="mt-4 text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1">
                          Read More →
                        </button>
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
              <h4 className="text-xl font-bold mb-5 text-blue-900">Most Read</h4>
              <ul className="space-y-4 text-gray-700">
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  Global Economy Insights
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  AI in Daily Life
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  Renewable Energy Push
                </li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors font-medium flex items-center gap-2 group">
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  New Discoveries in Space
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-100">
              <h5 className="font-bold mb-5 text-blue-900 text-lg">Editor's Picks</h5>
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
                      The Silent Crisis: How Deforestation is Changing Our Planet
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
                      The Culinary Revolution: A Look Inside the World's Top Kitchens
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-700 border-t-4 border-blue-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-white">
          <div className="font-bold text-lg mb-2">NewsToday</div>
          <div className="text-blue-100">
            © {new Date().getFullYear()} NewsToday. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}