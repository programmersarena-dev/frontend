import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import axiosClient from "@/api/axios";
import StandingsUserSubmissions from "@/components/Contest/StandingsUserSubmissions";
import CountdownTimer from "@/components/core/CountdownTimer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

const CheckboxFilter = ({ checked, onChange, __ }) => (
  <label className="inline-flex items-center gap-2 py-3 text-xs font-medium text-slate-500 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-0"
    />
    {__("contest.show-unofficial")}
  </label>
);

const getProblemChar = (index) => String.fromCharCode("A".charCodeAt(0) + index);

const rankedStandings = (data) => {
  const sortedStandings = [...data.standings].sort(
    (a, b) => b.total_score - a.total_score
  );
  let lastScore = null;
  let lastRank = 0;

  return sortedStandings.map((user, index) => {
    const currentScore = user.total_score;
    if (currentScore === lastScore) {
      user.rank = lastRank;
    } else {
      lastRank = index + 1;
      user.rank = lastRank;
    }
    lastScore = currentScore;
    return user;
  });
};

const tierClass = (index, oneSixth) => {
  if (index >= 0 && index < oneSixth) return "border-l-2 border-l-amber-400";
  if (index >= oneSixth && index < oneSixth * 3) return "border-l-2 border-l-slate-300";
  if (index >= oneSixth * 3 && index < oneSixth * 6) return "border-l-2 border-l-orange-300/70";
  return "border-l-2 border-l-transparent";
};

const StandingsTable = ({ data, currentUser, onClick, contestId, contestType, __ }) => {
  const halfParticipants = data.standings.length / 2;
  const oneSixth = halfParticipants / 6;
  const isDuel = contestType === "Duel";

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <th className="py-2.5 px-2 w-10 text-center font-semibold">#</th>
          <th className="py-2.5 px-3 text-left font-semibold">{__("contest.user")}</th>
          <th className="py-2.5 px-2 w-12 text-center font-semibold">=</th>
          {data.problemScores?.map((score, index) => (
            <th key={index} className="py-2.5 px-2 w-12 text-center font-semibold">
              <Link
                to={`/contest/${data.contest.id}/problem/${getProblemChar(index)}`}
                className="text-slate-500 hover:text-indigo-600 normal-case font-mono transition-colors"
              >
                {getProblemChar(index)}
              </Link>
              {!data.contest.subtasks && (
                <div className="text-[10px] font-normal text-slate-300 normal-case">
                  {score}
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.standings?.length > 0 ? (
          rankedStandings(data).map((user, index) => {
            const isCurrentUser = user.username === currentUser.name;
            return (
              <tr
                key={index}
                className={`${tierClass(index, oneSixth)} ${
                  isCurrentUser ? "bg-indigo-50/50" : "hover:bg-slate-50/70"
                } transition-colors`}
              >
                <td className="py-2.5 px-2 text-center font-mono text-xs text-slate-500">
                  {user.rank}
                </td>
                <td className="py-2.5 px-3 text-left">
                  {isDuel ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/profile/${user.username}`}
                        className="font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {user.username}
                      </Link>
                      <span className="text-slate-300 text-xs">vs</span>
                      <Link
                        to={`/profile/${user.username2}`}
                        className="font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {user.username2}
                      </Link>
                    </span>
                  ) : (
                    <Link
                      to={`/profile/${user.username}`}
                      className="font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {user.username}
                    </Link>
                  )}
                </td>
                <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-900">
                  {isDuel ? (
                    <span>
                      {user.total_score}
                      <span className="text-slate-300 px-1">:</span>
                      {user.total_score2}
                    </span>
                  ) : user.total_score === 0 ? (
                    <span className="text-slate-300">—</span>
                  ) : (
                    user.total_score
                  )}
                </td>
                {user.problems?.map((problem, problemIndex) => {
                  const p2 = isDuel ? user.problems2[problemIndex] : null;
                  return (
                    <td
                      key={problemIndex}
                      className="py-2.5 px-2 text-center cursor-pointer"
                      onDoubleClick={() =>
                        onClick(
                          `/contest/${contestId}/problem/${problemIndex + 1}/user/${user.username}`
                        )
                      }
                    >
                      {isDuel ? (
                        problem.score > p2.score && problem.score > 0 ? (
                          <div>
                            <div className="font-mono font-semibold text-xs text-slate-900">
                              {problem.score}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {problem?.accepted_at}
                            </span>
                          </div>
                        ) : p2.score > 0 ? (
                          <div>
                            <div className="font-mono font-semibold text-xs text-slate-500">
                              {p2.score}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {problem?.accepted_at}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-200">·</span>
                        )
                      ) : problem.score !== 0 ? (
                        <div>
                          <div
                            className={`font-mono font-semibold text-xs ${
                              problem.score < 0 ? "text-slate-400" : "text-emerald-600"
                            }`}
                          >
                            {problem.score}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {problem?.accepted_at}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-200">·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="100%" className="py-10 text-center text-sm text-slate-400">
              {__("contest.participants-not-found")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default function ContestStandingsView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  const fetchSubmissions = (url) => {
    axiosClient
      .get(url)
      .then((res) => {
        setSubmissions(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => console.error("Failed to fetch submissions:", err));
  };

  const getStandings = (url = `/contest/${id}/standings`) => {
    url += checkbox ? "?unofficial=true" : "?unofficial=false";
    setLoading(true);
    axiosClient
      .get(url)
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch standings:", err);
        setLoading(false);
      });
  };

  const toggleCheckbox = () => setCheckbox((prev) => !prev);

  useEffect(() => {
    getStandings();
  }, [checkbox]);

  if (loading) return <Loading />;
  if (!data.standings) return <NotFound />;

  return (
    <div className="px-4 sm:px-6 py-8">
      <StandingsUserSubmissions
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submissions={submissions}
        contestId={id}
        contestStartDate={data.contest.start_date}
      />

      <div className="text-center space-y-1 mb-6">
        <Link
          to={`/contest/${data.contest.id}`}
          className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
        >
          {data.contest.name}
        </Link>
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
          {__("contest.standings")}
        </div>
        <CountdownTimer
          dateString={data.contest.end_date}
          className="text-xs font-mono text-slate-500"
        />
      </div>
      
      <div className="flex justify-end border-b border-slate-100">
        <CheckboxFilter checked={checkbox} onChange={toggleCheckbox} __={__} />
      </div>

      <div className="overflow-x-auto">
        <StandingsTable
          data={data}
          currentUser={currentUser}
          onClick={fetchSubmissions}
          contestId={id}
          contestType={data.contest.type}
          __={__}
        />
      </div>
    </div>
  );
}