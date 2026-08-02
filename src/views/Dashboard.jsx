import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading.jsx";
import FormatToUTC from "@/components/core/FormatToUTC.jsx";
import PaginationLinks from "@/components/core/PaginationLinks.jsx";
import { CalendarDaysIcon, NewspaperIcon } from "@heroicons/react/24/outline";

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
        console.error("Error fetching blogs:", error);
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
    <div className="min-h-screen bg-slate-50/50 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Blog Cards (1 Item Per Row) */}
        {blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                  </h2>
                  <div
                    className="text-slate-600 text-sm leading-relaxed line-clamp-3 prose prose-slate max-w-none mb-5"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-slate-400">
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                    <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400" />
                    <FormatToUTC dateTime={blog.createdAt} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <NewspaperIcon className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No updates yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Check back later for new announcements or contest news.
            </p>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}