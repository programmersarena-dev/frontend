import { useEffect, useState } from "react";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import ContestItem from "@/components/Contest/ContestItem";
import PaginationLinks from "@/components/core/PaginationLinks";
import { useTranslation } from "@/contexts/TranslationContext";
import { TrophyIcon, CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Contests() {
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState({});

  const TABLE_HEAD = [
    { label: __("contest.type") || "Type", align: "text-left" },
    { label: __("contest.name") || "Name", align: "text-left" },
    { label: __("contest.authors") || "Authors", align: "text-left" },
    { label: __("contest.start-time") || "Start Time", align: "text-center" },
    { label: __("contest.duration") || "Duration", align: "text-center" },
    { label: __("contest.status") || "Status", align: "text-center" },
    { label: __("contest.participants") || "Participants", align: "text-center" },
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
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* Upcoming / Active Contests Section */}
        {upcomingContests.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h2 className="text-lg font-semibold text-slate-900">
                  {__("contest.upcoming-contests") || "Upcoming & Active Contests"}
                </h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                {upcomingContests.length} {upcomingContests.length === 1 ? "Contest" : "Contests"}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {TABLE_HEAD.map((head, index) => (
                        <th key={index} className={`px-4 py-3.5 ${head.align}`}>
                          {head.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-sm">
                    {[...upcomingContests].reverse().map((contest, index) => (
                      <ContestItem key={contest.id || index} contest={contest} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Finished Contests Section */}
        {finishedContests.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">
                  {__("contest.finished-contests") || "Past Contests"}
                </h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {finishedContests.length}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {TABLE_HEAD.map((head, index) => (
                        <th key={index} className={`px-4 py-3.5 ${head.align}`}>
                          {head.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-sm">
                    {finishedContests.map((contest, index) => (
                      <ContestItem key={contest.id || index} contest={contest} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Minimalist Empty State */}
        {contests.length === 0 && (
          <div className="mx-auto my-12 max-w-md rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white/50">
            <TrophyIcon className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              {__("contest.no-contests") || "No contests found"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {__("contest.no-contests-description") || "Check back later for new upcoming contests and challenges."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {contests.length > 0 && (
          <div className="flex justify-center pt-4">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}