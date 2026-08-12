import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "../../../components/core/Loading";
import PaginationLinks from "../../../components/core/PaginationLinks";
import { useTranslation } from "../../../contexts/TranslationContext";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProblemSetStandingsView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});

  const onPageClick = (link) => {
    getStandings(link.url);
  };

  const getStandings = (url) => {
    url = url || "/problems/standings";
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
      <div className="bg-white border-t border-b border-zinc-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="w-16 py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                #
              </th>
              <th className="py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("problem.user")}
              </th>
              <th className="w-40 py-2.5 px-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("problem.count-solved")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.length > 0 &&
              users.map((user, index) => {
                const isCurrentUser = user.handle === currentUser?.handle;
                return (
                  <tr
                    key={user.id ?? index}
                    className={`relative transition-colors duration-100 hover:bg-zinc-50 ${isCurrentUser ? "bg-teal-50/40" : ""
                      }`}
                  >
                    <td className="py-2 px-2 relative">
                      {isCurrentUser && (
                        <span
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-600"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-mono tabular-nums text-zinc-500">
                        {(meta.current_page - 1) * meta.per_page + index + 1}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <Link
                        to={`/profile/${user.handle}`}
                        className="font-medium text-zinc-800 hover:text-teal-700 transition-colors"
                      >
                        {user.handle}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-zinc-500">
                      {user.accepted_problems_count}
                    </td>
                  </tr>
                );
              })}
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="py-10 text-center text-zinc-400">
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