import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "../components/core/Loading";
import PaginationLinks from "../components/core/PaginationLinks";
import { useStateContext } from "../contexts/ContextProvider";
import ReactCountryFlag from "react-world-flags";
import { useTranslation } from "../contexts/TranslationContext";
import { useAuth } from "../contexts/AuthContext";

export default function Rating() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});

  const onPageClick = (link) => {
    getRatings(link.url);
  };

  const getRatings = (url) => {
    url = url || "/ratings";
    axiosClient
      .get(url)
      .then((res) => {
        setUsers(res.data.data);
        setMeta(res.data.meta);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRatings();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="overflow-x-auto pt-5">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm text-center">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 w-32">#</th>
              <th className="py-2 px-4 text-left">{__("rating.user")}</th>
              <th className="py-2 w-40">{__("rating.participation-number")}</th>
              <th className="py-2 w-40">=</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.length > 0 &&
              users.map((user, index) => (
                <tr key={index} className={`${user.name === currentUser?.name ? 'text-center bg-gray-100' : 'text-center'}`}>
                  <td className="border px-4 py-2">
                    {(meta.current_page - 1) * meta.per_page + index + 1}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/profile/${user.name}`}
                      className="flex items-center space-x-3 group hover:text-blue-600"
                    >
                      {user.country && (<ReactCountryFlag code={user.country} svg style={{ width: '24px', height: '24px' }} />)}
                      <span className="font-medium text-gray-700 group-hover:underline">{user.name}</span>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    {user.participationCount}
                  </td>
                  <td className="border px-4 py-2">
                    {user.currentRating}
                  </td>
                </tr>
              ))}
            {users.length == 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 text-center bg-gray-200 text-gray-600"
                >
                  {__("rating.users-not-found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <div className="mt-6">
          <PaginationLinks meta={meta} onPageClick={onPageClick} />
        </div>
      )}
    </div>
  );
}
