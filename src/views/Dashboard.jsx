import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import Loading from "../components/core/Loading.jsx";
import FormatToUTC from "../components/core/FormatToUTC.jsx";
import PaginationLinks from "../components/core/PaginationLinks.jsx";
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
    <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 text-white shadow-xl ring-1 ring-slate-200/20">
          <h1 className="text-3xl font-semibold tracking-tight">Latest updates</h1>
          <p className="mt-2 text-slate-300">Stay on top of announcements, contest news, and platform updates.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-4 text-xl font-semibold text-slate-900">{blog.title}</div>
              <div
                className="text-slate-700 mb-5 overflow-hidden max-h-28"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="inline-flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <span><FormatToUTC dateTime={blog.createdAt} /></span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="mt-10">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}
