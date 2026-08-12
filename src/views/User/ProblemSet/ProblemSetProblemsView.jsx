import React, { useEffect, useState } from "react";
import {
  BoltIcon,
  CheckIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
  ArrowUpCircleIcon
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
    if (hideSolved) {
      params.hideSolved = "true";
    }
    if (difficultyMin !== "") {
      params.difficultyMin = difficultyMin;
    }
    if (difficultyMax !== "") {
      params.difficultyMax = difficultyMax;
    }
    if (order !== "") {
      params.order = order;
    }

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
    <div className="px-4">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="w-24 px-5 py-3.5 text-center">#</th>
                    <th className="px-5 py-3.5">{__("problem.name")}</th>
                    <th className="w-28 px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleSortOrderChange("rating")}
                        title="Difficulty order"
                        className={`inline-flex items-center gap-1 hover:text-slate-800 transition-colors focus:outline-none ${order.includes("RATING") ? "text-indigo-600 font-bold" : ""
                          }`}
                      >
                        <BoltIcon className="w-4 h-4 text-amber-500" />
                        <span>Rating</span>
                        <ArrowUpCircleIcon className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="w-32 px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleSortOrderChange("solved")}
                        title="Solved count order"
                        className={`inline-flex items-center gap-1 hover:text-slate-800 transition-colors focus:outline-none ${order.includes("SOLVED") ? "text-indigo-600 font-bold" : ""
                          }`}
                      >
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                        <span>Solved</span>
                        <ArrowUpCircleIcon className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {problems.length > 0 ? (
                    problems.map((problem) => {
                      const problemUrl = `/problemset/problem/${problem.contest_id}/${problem.char}`;
                      const statusUrl = `/problemset/status/${problem.contest_id}/problem/${problem.char}`;

                      return (
                        <tr
                          key={`${problem.contest_id}-${problem.char}`}
                          className={`group hover:bg-slate-50/60 transition-colors ${problem.solved === 1
                            ? "bg-emerald-50/20"
                            : problem.solved === -1
                              ? "bg-rose-50/20"
                              : ""
                            }`}
                        >
                          {/* Problem Code */}
                          <td className="px-5 py-4 text-center font-mono text-xs font-semibold text-slate-500">
                            <Link
                              to={problemUrl}
                              className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              {problem.contest_id}/{problem.char}
                            </Link>
                          </td>

                          {/* Problem Name & Tags */}
                          <td className="px-5 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {problem.solved === 1 && (
                                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" title="Solved" />
                                )}
                                {problem.solved === -1 && (
                                  <XCircleIcon className="w-4 h-4 text-rose-500 shrink-0" title="Attempted" />
                                )}
                                <Link
                                  to={problemUrl}
                                  className="font-medium text-slate-800 hover:text-indigo-600 transition-colors"
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
                                      className="inline-block px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-slate-100/80 rounded-md border border-slate-200/50"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Rating / Difficulty */}
                          <td className="px-4 py-4 text-center font-mono text-xs font-medium text-slate-600">
                            {problem.difficulty ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                {problem.difficulty}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>

                          {/* Submissions */}
                          <td className="px-4 py-4 text-center">
                            <Link
                              to={statusUrl}
                              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{problem.accepted_submissions || 0}</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <InboxIcon className="w-8 h-8 text-slate-300 mb-2" />
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
            <div className="mt-6 sm:justify-start">
              <PaginationLinks meta={meta} onPageClick={onPageClick} />
            </div>
          )}
        </div>

        {/* Sidebar Container */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
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