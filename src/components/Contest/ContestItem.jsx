import React, { useState, useEffect } from "react";
import { ChevronDoubleRightIcon, UserIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "@/components/core/CountdownTimer";
import { Link } from "react-router-dom";
import FormatToUTC from "@/components/core/FormatToUTC";
import UserContestRegisterButton from "@/components/Contest/UserContestRegisterButton";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContestItem({ contest, index }) {
  const { __ } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startDate = new Date(contest.start_date);
    const endDate = new Date(contest.end_date);

    if (
      (contest.status === "notStarted" && currentDate > startDate) ||
      (contest.status === "started" && currentDate > endDate)
    ) {
      window.location.reload();
    }
  }, [currentDate, contest]);

  const totalParticipants =
    (contest.participants?.official?.length || 0) +
    (contest.participants?.unofficial?.length || 0);

  return (
    <tr className="bg-white hover:bg-slate-50/80 border-b border-slate-200 last:border-0 transition-colors duration-150">
      {/* Type Badge */}
      <td className="p-4 text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
          {contest.type}
        </span>
      </td>

      {/* Contest Name & Enter Link */}
      <td className="p-4 max-w-xs">
        <div className="flex flex-col items-start gap-1.5">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {contest.name}
          </span>
          {contest.status === "ended" && (
            <Link
              to={`/contest/${contest.id}`}
              className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <span>{__("contest.enter") || "Enter"}</span>
              <ChevronDoubleRightIcon className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>
      </td>

      {/* Authors */}
      <td className="p-4 text-center">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[150px] mx-auto">
          {contest.authors &&
            contest.authors.map((author) => (
              <Link
                key={author}
                to={`/profile/${author}`}
                className="text-xs font-medium text-slate-700 hover:text-indigo-600 border border-slate-200 bg-slate-100/70 hover:bg-slate-100 px-2 py-0.5 rounded-md transition-colors"
              >
                {author}
              </Link>
            ))}
        </div>
      </td>

      {/* Start Date */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-xl">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <FormatToUTC dateTime={contest.start_date} />
        </div>
      </td>

      {/* Duration */}
      <td className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>{contest.duration}</span>
        </div>
      </td>

      {/* Status & Countdown Timer */}
      <td className="p-4 text-center">
        {contest.status === "ended" ? (
          <Link
            to={`/contest/${contest.id}/standings`}
            className="inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {__("contest.final-results") || "Final Standings"}
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-slate-500">
              {contest.status === "started" && (
                <div className="flex flex-col gap-1">
                  <Link
                    to={`/contest/${contest.id}/standings`}
                    className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                  >
                    {__("contest.online-results") || "Online Standings"}
                  </Link>
                  <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/80 self-center">
                    {__("contest.running") || "Running"}
                  </span>
                </div>
              )}
              {contest.status === "notStarted" && (
                <span className="uppercase tracking-wider text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {__("contest.starts-in") || "Starts In"}
                </span>
              )}
            </span>
            <CountdownTimer
              dateString={contest.status === "started" ? contest.end_date : contest.start_date}
              className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200"
            />
          </div>
        )}
      </td>

      {/* Participants & Registration */}
      <td className="p-4 text-center">
        {contest.status === "ended" ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-xl">
            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>{totalParticipants}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {contest.status === "started" ? (
              <>
                <Link
                  to={`/contest/${contest.id}`}
                  className="inline-flex items-center justify-center py-1.5 px-3 border border-transparent text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:bg-indigo-700 transition duration-200 shadow-sm"
                >
                  <span>{__("contest.enter") || "Enter"}</span>
                  <ChevronDoubleRightIcon className="w-3.5 h-3.5 ml-1" />
                </Link>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {__("contest.registration-closed") || "Registration Closed"}
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                    <span>{totalParticipants}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <UserContestRegisterButton contest={contest} />
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <div className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                    <span>{totalParticipants}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                    <span>{__("contest.closes-in") || "Closes in"}</span>
                    <CountdownTimer
                      dateString={contest.start_date}
                      className="text-slate-600 font-mono"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}