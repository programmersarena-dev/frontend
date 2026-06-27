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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-10">

        {upcomingContests.length > 0 && (
          <div className="bg-slate-950 p-6 rounded-3xl shadow-2xl border border-slate-800/60 overflow-hidden">
            <div className="text-xl font-extrabold text-slate-100 tracking-tight mb-4 px-2">
              {__("contest.upcoming-contests") || "Upcoming Contests"}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full min-w-max table-auto text-left border-collapse bg-slate-900/50">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={index}
                        className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...upcomingContests].reverse().map((contest, index) => (
                    <ContestItem key={contest.id || index} contest={contest} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {finishedContests.length > 0 && (
          <div className="bg-slate-950 p-6 rounded-3xl shadow-2xl border border-slate-800/60 overflow-hidden">
            <div className="text-xl font-extrabold text-slate-100 tracking-tight mb-4 px-2">
              {__("contest.finished-contests") || "Finished Contests"}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full min-w-max table-auto text-left border-collapse bg-slate-900/50">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={index}
                        className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {finishedContests.map((contest, index) => (
                    <ContestItem key={contest.id || index} contest={contest} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {contests.length === 0 && (
          <div className="w-full max-w-md mx-auto text-center bg-slate-950 p-8 rounded-3xl shadow-2xl border border-slate-800/60">
            <p className="text-sm text-slate-400 font-medium">
              {__("contest.no-contests") || "No contests found."}
            </p>
          </div>
        )}

        {contests.length > 0 && (
          <div className="flex justify-center pt-4">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}