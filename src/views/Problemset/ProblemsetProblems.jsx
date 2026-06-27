import React, { useEffect, useState } from "react";
import { BoltIcon, CheckIcon, UserIcon } from "@heroicons/react/24/outline";
import axiosClient from "@/api/axios";
import Loading from "../../components/core/Loading";
import PaginationLinks from "../../components/core/PaginationLinks";
import ProblemListSidebar from "../../components/Problemset/ProblemListSidebar";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

export default function ProblemsetProblems() {
  const { t } = useStateContext();
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

  const getProblems = (url = "/problemset") => {
    let params = {};
    if (hideSolved) {
      params.hideSolved = 'true';
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
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  };

  const handleSortOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  useEffect(() => {
    getProblems();
  }, [order, hideSolved, difficultyMin, difficultyMax]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="container mx-auto px-4 flex-1">
        <div className="shadow-md rounded-md overflow-hidden bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-12 px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                  #
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                  {t("problem.name")}
                </th>
                <th className="w-6 px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                  <button
                    onClick={() =>
                      handleSortOrderChange(order !== "BY_RATING_DESC" ? "BY_RATING_DESC" : "BY_RATING_ASC")
                    }
                    title="Çylşyrymlylygyna görä tertipleşdir"
                    className="focus:outline-none"
                  >
                    <BoltIcon className="w-5 h-5 text-yellow-500" />
                  </button>
                </th>
                <th className="w-6 px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                  <button
                    onClick={() =>
                      handleSortOrderChange(order !== "BY_SOLVED_DESC" ? "BY_SOLVED_DESC" : "BY_SOLVED_ASC")
                    }
                    title="Işlenen sanyna görä tertipleşdir"
                    className="focus:outline-none"
                  >
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.length > 0 ? (
                problems.map((problem, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                      <Link
                        to={`/problemset/problem/${problem.contest_id}/${problem.char}`}
                        className="hover:underline"
                      >
                        {problem.contest_id}/{problem.char}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/problemset/problem/${problem.contest_id}/${problem.char}`}
                          className="hover:underline"
                        >
                          {problem.name}
                        </Link>
                        {problem.tags && showTags && (
                          <div className="flex flex-wrap items-center ml-2">
                            {problem.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="mr-1 mt-1 px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500">
                      {problem.difficulty}
                    </td>
                    <td
                      className={`
                        px-6 py-4 text-sm text-center font-medium transition-colors duration-200
                        ${problem.solved === 1 ? "bg-green-100 text-green-700" : ""}
                        ${problem.solved === -1 ? "bg-red-100 text-red-700" : ""}
                      `}
                    >
                      <Link
                        to={`/problemset/status/${problem.contest_id}/problem/${problem.char}`}
                        className="flex items-center justify-center text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="ml-1">{problem.accepted_submissions}</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 text-center bg-gray-200 text-gray-600"
                  >
                    {t("problem.not-found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {problems.length > 0 && (
          <div className="mt-6">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>

      <div className="lg:w-1/4 px-4 py-6 lg:py-0 bg-white">
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
    </div>
  );
}
