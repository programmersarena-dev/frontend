import { useEffect, useState } from "react";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import ContestItem from "@/components/Contest/ContestItem";
import PaginationLinks from "@/components/core/PaginationLinks";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Contests() {
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState({});

  const TABLE_HEAD = [
    __("contest.type") || "Type",
    __("contest.name") || "Name",
    __("contest.authors") || "Authors",
    __("contest.start-time") || "Start Time",
    __("contest.duration") || "Duration",
    __("contest.status") || "Status",
    __("contest.participants") || "Participants",
  ];

  const onPageClick = (link) => {
    getContests(link.url);
  };

  const getContests = (url) => {
    url = url || "/contests";
    setLoading(true);
    axiosClient
      .get(url)
      .then((response) => {
        setContests(response.data.data || []);
        setMeta(response.data.meta || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getContests();
  }, []);

  if (loading) return <Loading />;

  const upcomingContests = contests.filter((item) => item.status !== "ended");
  const finishedContests = contests.filter((item) => item.status === "ended");

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Upcoming Contests Section */}
        {upcomingContests.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="text-xl font-bold text-slate-900 tracking-tight mb-4 px-1 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {__("contest.upcoming-contests") || "Upcoming Contests"}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-max table-auto text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200">
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={index}
                        className="p-3.5 text-xs font-semibold uppercase tracking-wider text-slate-600 text-center"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...upcomingContests].reverse().map((contest, index) => (
                    <ContestItem key={contest.id || index} contest={contest} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Finished Contests Section */}
        {finishedContests.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="text-xl font-bold text-slate-900 tracking-tight mb-4 px-1">
              {__("contest.finished-contests") || "Finished Contests"}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-max table-auto text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200">
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={index}
                        className="p-3.5 text-xs font-semibold uppercase tracking-wider text-slate-600 text-center"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finishedContests.map((contest, index) => (
                    <ContestItem key={contest.id || index} contest={contest} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {contests.length === 0 && (
          <div className="w-full max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
            <p className="text-sm text-slate-500 font-medium">
              {__("contest.no-contests") || "No contests found."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {contests.length > 0 && (
          <div className="flex justify-center pt-2">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}