import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { Link, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const COLUMNS = [
  { label: "ID", key: "id" },
  { label: "Bäsleşik", key: null },
  { label: "Ýeri", key: "rank" },
  { label: "Işlän mesele sany", key: "solved" },
  { label: "Reýting üýtgemesi", key: "rating" },
  { label: "Täze reýting", key: "new_rating" },
];

export default function ProfileRatingsView() {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const { username } = useParams();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  useEffect(() => {
    axiosClient
      .get(`/profile/${username}/ratings`)
      .then((res) => {
        setRatings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [username]);

  const handleSort = (key) => {
    if (!key) return;
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedContestRatings = () => {
    if (!ratings || !ratings.contest_ratings) return [];
    const sorted = [...ratings.contest_ratings];
    if (!sortConfig.key) return sorted;
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  if (loading) {
    return <Loading />;
  }

  const rows = sortedContestRatings();

  return (
    <div className="px-4 py-10 space-y-6">
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1">
        {COLUMNS.filter((c) => c.key).map((col) => {
          const active = sortConfig.key === col.key;
          return (
            <button
              key={col.key}
              onClick={() => handleSort(col.key)}
              className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
                active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {col.label}
              {active &&
                (sortConfig.direction === "ascending" ? (
                  <ChevronUpIcon className="w-3 h-3" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3" />
                ))}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        {rows.length > 0 ? (
          rows.map((userContest, index) => {
            const change = userContest.rating;
            const isPositive = change > 0;
            const isNegative = change < 0;
            return (
              <div
                key={userContest.id ?? index}
                className="flex flex-col gap-2 py-3.5 px-1 border-b border-slate-100 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/contest/${userContest.contest.id}`}
                    className="text-[13.5px] font-medium text-slate-900 hover:text-indigo-600 transition-colors truncate"
                  >
                    {userContest.contest.name}
                  </Link>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    #{userContest.id}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono text-slate-500">
                  <span title="Ýeri">#{userContest.rank}</span>
                  <span title="Işlän mesele sany">{userContest.solved}</span>
                  <span
                    className={`font-semibold ${
                      isPositive
                        ? "text-emerald-600"
                        : isNegative
                        ? "text-rose-500"
                        : "text-slate-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {userContest.rating}
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {userContest.new_rating}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-slate-400 py-10">
            Bäsleşikler tapylmady.
          </div>
        )}
      </div>
    </div>
  );
}