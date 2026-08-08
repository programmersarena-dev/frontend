import { useEffect, useState } from "react";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import ContestItem from "@/components/Contest/ContestItem";
import PaginationLinks from "@/components/core/PaginationLinks";
import { useTranslation } from "@/contexts/TranslationContext";
import { TrophyIcon } from "@heroicons/react/24/outline";

export default function ContestsView() {
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState({});

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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">

        {upcomingContests.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <h2 className="text-sm font-semibold text-slate-900">
                {__("contest.upcoming-contests") || "Upcoming & active"}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {upcomingContests.length}
              </span>
            </div>

            <div className="flex flex-col">
              {[...upcomingContests].reverse().map((contest, index) => (
                <ContestItem key={contest.id || index} contest={contest} index={index} />
              ))}
            </div>
          </section>
        )}

        {finishedContests.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-1 px-1">
              <h2 className="text-sm font-semibold text-slate-900">
                {__("contest.finished-contests") || "Past contests"}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {finishedContests.length}
              </span>
            </div>

            <div className="flex flex-col">
              {finishedContests.map((contest, index) => (
                <ContestItem key={contest.id || index} contest={contest} index={index} />
              ))}
            </div>
          </section>
        )}

        {contests.length === 0 && (
          <div className="mx-auto my-16 max-w-sm text-center">
            <TrophyIcon className="mx-auto h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              {__("contest.no-contests") || "No contests found"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {__("contest.no-contests-description") ||
                "Check back later for new upcoming contests and challenges."}
            </p>
          </div>
        )}

        {contests.length > 0 && (
          <div className="pt-2">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </div>
  );
}