import React, { useState, useEffect } from "react";
import { ChevronDoubleRightIcon, UserCircleIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import CountdownTimer from "@/components/core/CountdownTimer";
import { useStateContext } from "@/contexts/ContextProvider";
import { Link } from "react-router-dom";
import FormatToUTC from "@/components/core/FormatToUTC";
import UserContestRegisterButton from "@/components/Contest/UserContestRegisterButton";

export default function ContestItem({ contest, index }) {
  const { t } = useStateContext();
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

  return (
    <tr className="hover:bg-gray-100">

      <td className="p-4 border-b border-gray-300 text-center mw-6">
        <div className="relative flex items-center p-4">
          {contest.type}
        </div>
      </td>

      <td className="p-4 border-b border-gray-300">
        <div className="flex flex-col items-center justify-between">
          {contest.name}
          {contest.status === "ended" && (
            <Link
              to={`/contest/${contest.id}`}
              className="flex items-center text-blue-500 hover:underline ml-2"
            >
              {t("contest.enter")}
              <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
      </td>

      <td className="p-4 border-b border-gray-300 text-center">
        {contest.authors &&
          contest.authors.map((author, index) => (
            <div className="p-1" key={index}>
              <Link
                to={`/profile/${author}`}
                key={author}
                className="text-blue-500 hover:underline"
              >
                {author}
              </Link>
            </div>
          ))}
      </td>

      <td className="p-4 border-b border-gray-300 text-center">
        <FormatToUTC dateTime={contest.start_date} />
      </td>

      <td className="p-4 border-b border-gray-300 text-center">
        {contest.duration}
      </td>

      <td className="p-4 border-b border-gray-300 text-center">
        {contest.status === "ended" ? (
          <Link
            to={`/contest/${contest.id}/standings`}
            className="text-blue-500 hover:underline text-center"
          >
            {t("contest.final-results")}
          </Link>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-gray-600">
              {contest.status === "started" && (
                <div>
                  <div>
                    <Link
                      to={`/contest/${contest.id}/standings`}
                      className="text-blue-500 hover:underline"
                    >
                      {t("contest.online-results")}
                    </Link>
                  </div>
                  <div>{t("contest.running")}</div>
                </div>
              )}
              {contest.status === "notStarted" && <div>{t("contest.starts-in")}</div>}
            </span>
            {contest.status === "started" && (
              <CountdownTimer
                dateString={contest.end_date}
                className="text-gray-400"
              />
            )}
            {contest.status === "notStarted" && (
              <CountdownTimer
                dateString={contest.start_date}
                className="text-gray-400"
              />
            )}
          </div>
        )}
      </td>

      <td className="p-4 border-b border-gray-300 text-center">
        {contest.status === "ended" ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 text-cyan-600" />
              <div className="ml-2">
                x
                {contest.participants.official.length +
                  contest.participants.unofficial.length}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {contest.status === "started" ? (
              <>
                <div className="w-24">
                  <Link
                    to={`/contest/${contest.id}`}
                    className="flex items-center text-blue-500 px-4 py-2 rounded hover:underline mb-1"
                  >
                    <span>{t("contest.enter")}</span>
                    <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span>{t("contest.registration-closed")}</span>
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 text-cyan-600" />
                    <div className="ml-2">
                      x
                      {contest.participants.official.length +
                        contest.participants.unofficial.length}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <UserContestRegisterButton contest={contest} />
                <div className="flex items-center">
                  <UserIcon className="w-3 h-3 text-cyan-600" />
                  <div className="ml-2 text-sm">
                    x
                    {contest.participants.official.length +
                      contest.participants.unofficial.length}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span>{t("contest.closes-in")}</span>
                  <CountdownTimer
                    dateString={contest.start_date}
                    className="text-gray-400 ml-1"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </td>

    </tr >
  );
}
