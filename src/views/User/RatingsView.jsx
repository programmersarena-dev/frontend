import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import PaginationLinks from "@/components/core/PaginationLinks";
import ReactCountryFlag from "react-world-flags";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";

function getRatingTier(rating) {
  if (rating >= 2400) return { color: "text-red-600" };
  if (rating >= 2100) return { color: "text-orange-500" };
  if (rating >= 1900) return { color: "text-purple-600" };
  if (rating >= 1600) return { color: "text-blue-600" };
  if (rating >= 1400) return { color: "text-cyan-600" };
  if (rating >= 1200) return { color: "text-emerald-600" };
  return { color: "text-zinc-500" };
}

export default function RatingsView() {
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
      <div className="bg-white border-t border-b border-zinc-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="w-16 py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                #
              </th>
              <th className="py-2.5 px-2 text-left text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("rating.user")}
              </th>
              <th className="w-44 py-2.5 px-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("rating.participation-number")}
              </th>
              <th className="w-32 py-2.5 px-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {__("rating.rating")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.length > 0 &&
              users.map((user, index) => {
                const isCurrentUser = user.handle === currentUser?.handle;
                const tier = getRatingTier(user.currentRating);

                return (
                  <tr
                    key={user.id ?? index}
                    className={`relative transition-colors duration-100 hover:bg-zinc-50 ${
                      isCurrentUser ? "bg-teal-50/40" : ""
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
                        className="group inline-flex items-center gap-2"
                      >
                        {user.country && (
                          <ReactCountryFlag
                            code={user.country}
                            svg
                            style={{ width: "18px", height: "13px" }}
                            className="rounded-[2px] shrink-0"
                          />
                        )}
                        <span
                          className={`font-medium group-hover:underline ${tier.color}`}
                        >
                          {user.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-right font-mono tabular-nums text-zinc-500">
                      {user.participationCount}
                    </td>
                    <td
                      className={`py-2 px-2 text-right font-mono tabular-nums font-semibold ${tier.color}`}
                    >
                      {user.currentRating}
                    </td>
                  </tr>
                );
              })}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-zinc-400">
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