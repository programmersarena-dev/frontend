import React, { useEffect, useState } from "react";
import {
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import PaginationLinks from "@/components/core/PaginationLinks";
import ProblemListSidebar from "@/components/Problemset/ProblemListSidebar";
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ProblemSetProblemsView() {
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [meta, setMeta] = useState({});
  const [showTags, setShowTags] = useState(true);
  const [hideSolved, setHideSolved] = useState(false);
  const [difficultyMin, setDifficultyMin] = useState("");
  const [difficultyMax, setDifficultyMax] = useState("");
  const [order, setOrder] = useState("");

  const onPageClick = (link) => {
    getProblems(link.url);
  };

  const getProblems = (url = "/problems") => {
    let params = {};
    if (hideSolved) params.hideSolved = "true";
    if (difficultyMin !== "") params.difficultyMin = difficultyMin;
    if (difficultyMax !== "") params.difficultyMax = difficultyMax;
    if (order !== "") params.order = order;

    axiosClient
      .get(url, { params })
      .then((res) => {
        setProblems(res.data.data);
        setMeta(res.data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setLoading(false);
      });
  };

  const handleSortOrderChange = (type) => {
    if (type === "rating") {
      setOrder((prev) => (prev !== "BY_RATING_DESC" ? "BY_RATING_DESC" : "BY_RATING_ASC"));
    } else if (type === "solved") {
      setOrder((prev) => (prev !== "BY_SOLVED_DESC" ? "BY_SOLVED_DESC" : "BY_SOLVED_ASC"));
    }
  };

  useEffect(() => {
    getProblems();
  }, [order, hideSolved, difficultyMin, difficultyMax]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="w-20 px-4 py-3 text-center">#</th>
                    <th className="px-4 py-3">{__("problem.name")}</th>
                    <th className="w-28 px-4 py-3 text-center">
                      <button
                        onClick={() => handleSortOrderChange("rating")}
                        className={`inline-flex items-center gap-1 hover:text-zinc-700 transition-colors focus:outline-hidden ${
                          order.includes("RATING") ? "text-zinc-900 font-semibold" : ""
                        }`}
                      >
                        <span>Rating</span>
                        {order === "BY_RATING_ASC" ? (
                          <ChevronUpIcon className="w-3 h-3" />
                        ) : order === "BY_RATING_DESC" ? (
                          <ChevronDownIcon className="w-3 h-3" />
                        ) : null}
                      </button>
                    </th>
                    <th className="w-28 px-4 py-3 text-center">
                      <button
                        onClick={() => handleSortOrderChange("solved")}
                        className={`inline-flex items-center gap-1 hover:text-zinc-700 transition-colors focus:outline-hidden ${
                          order.includes("SOLVED") ? "text-zinc-900 font-semibold" : ""
                        }`}
                      >
                        <span>Solved</span>
                        {order === "BY_SOLVED_ASC" ? (
                          <ChevronUpIcon className="w-3 h-3" />
                        ) : order === "BY_SOLVED_DESC" ? (
                          <ChevronDownIcon className="w-3 h-3" />
                        ) : null}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {problems.length > 0 ? (
                    problems.map((problem) => {
                      const problemUrl = `/problemset/problem/${problem.contest_id}/${problem.char}`;
                      const statusUrl = `/problemset/status/${problem.contest_id}/problem/${problem.char}`;
                      const isAccepted = problem.tried && problem.accepted;
                      const isFailed = problem.tried && !problem.accepted;

                      return (
                        <tr
                          key={`${problem.contest_id}-${problem.char}`}
                          className={`group hover:bg-zinc-50/80 transition-colors ${
                            isAccepted ? "bg-emerald-50/50" : isFailed ? "bg-rose-50/50" : ""
                          }`}
                        >
                          {/* Problem Code */}
                          <td
                            className={`px-4 py-3 text-center font-mono text-xs text-zinc-400 group-hover:text-zinc-600 border-l-2 ${
                              isAccepted
                                ? "border-emerald-500"
                                : isFailed
                                ? "border-rose-500"
                                : "border-transparent"
                            }`}
                          >
                            <Link to={problemUrl} className="hover:underline">
                              {problem.contest_id}{problem.char}
                            </Link>
                          </td>

                          {/* Problem Name & Tags */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={problemUrl}
                                  className="font-medium text-zinc-900 hover:text-indigo-600 transition-colors"
                                >
                                  {problem.name}
                                </Link>
                              </div>

                              {/* Tags */}
                              {problem.tags && showTags && problem.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {problem.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 rounded-sm"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Difficulty / Rating */}
                          <td className="px-4 py-3 text-center font-mono text-xs">
                            {problem.difficulty ? (
                              <span className="text-zinc-600 font-medium">
                                {problem.difficulty}
                              </span>
                            ) : (
                              <span className="text-zinc-300">—</span>
                            )}
                          </td>

                          {/* Submissions */}
                          <td className="px-4 py-3 text-center">
                            <Link
                              to={statusUrl}
                              className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-indigo-600 transition-colors"
                            >
                              <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{problem.accepted_submissions_count}</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-zinc-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <InboxIcon className="w-7 h-7 text-zinc-300 stroke-[1.5]" />
                          <p className="text-sm">{__("problem.not-found") || "No problems found."}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {problems.length > 0 && (
            <div className="mt-4">
              <PaginationLinks meta={meta} onPageClick={onPageClick} />
            </div>
          )}
        </div>

        {/* Sidebar Container */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <ProblemListSidebar
              showTags={showTags}
              setShowTags={setShowTags}
              hideSolved={hideSolved}
              setHideSolved={setHideSolved}
              difficultyMin={difficultyMin}
              setDifficultyMin={setDifficultyMin}
              difficultyMax={difficultyMax}
              setDifficultyMax={setDifficultyMax}
              onReload={getProblems}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}