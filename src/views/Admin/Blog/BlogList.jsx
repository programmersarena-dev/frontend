import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "../../../components/core/Loading";
import PaginationLinks from "../../../components/core/PaginationLinks";
import FormatToUTC from "../../../components/core/FormatToUTC";
import {
  CalendarDaysIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/Admin/PageHeader";

export default function BlogList() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({});

  const onPageClick = (link) => {
    getBlogs(link.url);
  };

  const getBlogs = (url = "/admin/blog") => {
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

  const onDeleteClick = (id) => {
    if (window.confirm("Siz çyndanam pozmak isleýäňizmi?")) {
      setLoading(true);
      axiosClient
        .delete(`/admin/blog/${id}`)
        .then(() => {
          setBlogs((prev) => prev.filter((blog) => blog.id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error deleting blog:", err);
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader title="Bildirişler" />
        <Link
          to="/admin/blog/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <PlusIcon className="w-4 h-4" />
          Bildiriş goş
        </Link>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {/* Blog Items */}
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-xl border border-slate-200/80 p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                  {blog.title}
                </h3>
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/admin/blog/${blog.id}/edit`}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    title="Düzet"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDeleteClick(blog.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Poz"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HTML Description Content */}
              <div
                dangerouslySetInnerHTML={{ __html: blog.description }}
                className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 prose prose-slate max-w-none"
              />

              {/* Metadata Footer */}
              <div className="flex items-center text-xs font-medium text-slate-400 pt-3 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400" />
                  <FormatToUTC dateTime={blog.createdAt} />
                </span>
              </div>
            </article>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <NewspaperIcon className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Hiç hili bildiriş tapylmady</h3>
            <p className="mt-1 text-sm text-slate-500">Täze bildiriş goşmak üçin ýokardaky düwmä basyň.</p>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="pt-4">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </>
  );
}