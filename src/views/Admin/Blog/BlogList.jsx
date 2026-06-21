import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios";
import Loading from "../../../components/core/Loading";
import PaginationLinks from "../../../components/core/PaginationLinks";
import FormatToUTC from "../../../components/core/FormatToUTC";
import {
  CalendarDaysIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AdminComponent from "../../../components/Admin/AdminComponent";
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
        .then((res) => {
          setBlogs(blogs.filter((blog) => blog.id !== id));
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
    <AdminComponent>
      <div className="flex justify-between mb-6">
        <PageHeader title="Bildirişler" />
        <Link
          to="/admin/blog/add"
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Bildiriş goş
        </Link>
      </div>
      <div className="container mx-auto">
        <div className="space-y-6">
          {blogs.length > 0 && blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white p-6 border-l-4 border-blue-500 rounded-lg shadow-md w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-xl">{blog.title}</div>
                <div className="flex space-x-2">
                  <Link
                    to={`/admin/blog/${blog.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => onDeleteClick(blog.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: blog.description }}
                className="text-gray-700 mb-4"
              ></div>
              <div className="text-gray-600 text-sm flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-1" />
                <FormatToUTC dateTime={blog.createdAt} />
              </div>
            </div>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="mt-6">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </AdminComponent>
  );
}
