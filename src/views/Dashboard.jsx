import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading.jsx";
import FormatToUTC from "@/components/core/FormatToUTC.jsx";
import PaginationLinks from "@/components/core/PaginationLinks.jsx";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({});

  const onPageClick = (link) => {
    getBlogs(link.url);
  };

  const getBlogs = (url = "/blogs") => {
    axiosClient
      .get(url)
      .then((res) => {
        setBlogs(res.data.data);
        setMeta(res.data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Hero Banner */}
        <div className="mb-8 rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest updates
            </h1>
            <p className="mt-2 text-slate-600 font-medium max-w-xl">
              Stay on top of announcements, contest news, and platform updates.
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-indigo-200"
            >
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900 tracking-tight hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h2>
                <div
                  className="text-slate-600 mb-6 text-sm leading-relaxed overflow-hidden max-h-24 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <div className="inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-xl text-slate-700">
                  <CalendarDaysIcon className="h-4 w-4 text-slate-500" />
                  <span>
                    <FormatToUTC dateTime={blog.createdAt} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="w-full max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
            <p className="text-sm text-slate-500 font-medium">
              No updates or announcements available.
            </p>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="mt-10 flex justify-center">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}