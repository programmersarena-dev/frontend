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
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white p-6 border-l-4 border-blue-500 rounded-r-lg shadow-md w-full"
            >
              <div className="font-bold text-2xl mb-2">{blog.title}</div>
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
    </div>
  );
}
