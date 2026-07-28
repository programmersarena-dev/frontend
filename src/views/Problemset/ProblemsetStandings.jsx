import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "../../components/core/Loading";
import PaginationLinks from "../../components/core/PaginationLinks";
import { useTranslation } from "../../contexts/TranslationContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ProblemsetStandings() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});

  const onPageClick = (link) => {
    getStandings(link.url);
  };

  const getStandings = (url) => {
    url = url || "/problemset/standings";
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
    getStandings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 w-32">#</th>
              <th className="py-2">{__("problem.user")}</th>
              <th className="py-2 w-40">{__("problem.count-solved")}</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.map((user, index) => (
              <tr key={index} className={`${user.name === currentUser?.name ? 'text-center bg-gray-100' : 'text-center'}`}>
                <td className="border px-4 py-2">{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                <td className="border px-4 py-2">
                  <a href={`/profile/${user.name}`}>{user.name}</a>
                </td>
                <td className="border px-4 py-2">{user.accepted_problems_count}</td>
              </tr>
            ))}
            {users.length == 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="py-4 text-center bg-gray-200 text-gray-600"
                >
                  {__("problem.user-not-found")}
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
