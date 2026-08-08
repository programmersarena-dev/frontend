import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "../../../components/core/Loading";
import ProblemItem from "../../../components/Contest/ProblemItem";
import ContestDetails from "../../../components/Contest/ContestDetails";
import { useTranslation } from "../../../contexts/TranslationContext";

export default function ContestProblemsView() {
  const { __ } = useTranslation();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [contest, setContest] = useState(null);

  const TABLE_HEAD = [
    "#",
    __("contest.name") || "Name",
    ""
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axiosClient
      .get(`/contest/${id}/problems`)
      .then((res) => {
        if (isMounted) {
          setProblems(res.data.problems || []);
          setContest(res.data.contest || null);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching contest problems:", error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Problems Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-medium">
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={index}
                        className={`py-3.5 px-6 font-semibold ${
                          index === 0 ? "w-16 text-center" : ""
                        } ${index === TABLE_HEAD.length - 1 ? "text-right" : ""}`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {problems.length > 0 ? (
                    problems.map((problem, index) => (
                      <ProblemItem
                        key={problem.id}
                        index={index}
                        problem={problem}
                        contestId={id}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={TABLE_HEAD.length}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        {__("contest.no_problems") || "No problems available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Contest Sidebar / Details */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6">
            <ContestDetails contest={contest} />
          </div>
        </aside>
      </div>
    </div>
  );
}