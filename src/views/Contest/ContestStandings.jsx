import React, { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/core/Loading";
import NotFound from "../../components/core/NotFound";
import axiosClient from "@/api/axios";
import StandingsUserSubmissions from "../../components/Contest/StandingsUserSubmissions";
import CountdownTimer from "../../components/core/CountdownTimer";

const CheckboxFilter = ({ checked, onChange, t }) => (
  <div className="flex items-center space-x-2 py-2">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <label className="text-gray-800">{t("contest.show-unofficial")}</label>
  </div>
);

const getProblemChar = (index) => {
  return String.fromCharCode("A".charCodeAt(0) + index);
};

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

const StandingsTable = ({ data, currentUser, onClick, contestId, contestType, t }) => {
  const halfParticipants = data.standings.length / 2;
  const oneSixth = halfParticipants / 6;

  return (
    <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-center">
      <thead className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
        <tr>
          <th className="py-3 w-8 font-semibold tracking-wider">&#x2116;</th>
          <th className="py-3 w-48 font-semibold tracking-wider text-start pl-3">
            {t("contest.user")}
          </th>
          <th className="py-3 w-10 font-semibold tracking-wider">=</th>
          {data.problemScores?.map((score, index) => (
            <th key={index} className="py-3 w-10 font-semibold tracking-wider">
              <Link
                to={`/contest/${data.contest.id}/problem/${getProblemChar(
                  index
                )}`}
                className="underline"
              >
                {getProblemChar(index)}
              </Link>
              <div className="text-xs">{!data.contest.subtasks ? score : ""}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.standings?.length > 0 ? (
          rankedStandings(data).map((user, index) => (
            <tr
              key={index}
              className={`
                ${index >= 0 && index < oneSixth ? "bg-yellow-300" : ""}
                ${index >= oneSixth && index < oneSixth * 3 ? "bg-gray-300" : ""}
                ${index >= oneSixth * 3 && index < oneSixth * 6 ? "bg-orange-300" : ""}
                ${user.username === currentUser.name ? "border-2 border-green-500" : ""}
                transition-colors duration-200
              `}
            >
              <td className="border px-4 py-2">{user.rank}</td>
              <td className="border px-4 py-2 text-start pl-3">
                {contestType === 'Duel' ? (
                  <>
                    <Link
                      to={`/profile/${user.username}`}
                      className="text-blue-800 font-extrabold hover:underline"
                    >
                      {user.username}
                    </Link>
                    <span className="px-2">x</span>
                    <Link
                      to={`/profile/${user.username2}`}
                      className="text-red-800 font-extrabold hover:underline"
                    >
                      {user.username2}
                    </Link>
                  </>
                ) : (
                  <Link
                    to={`/profile/${user.username}`}
                    className="text-gray-800 hover:underline"
                  >
                    {user.username}
                  </Link>
                )}

              </td>
              <td className="border py-2 font-semibold">
                {contestType === 'Duel' ? (
                  <>
                    <span className="text-blue-800 font-extrabold">{user.total_score}</span>
                    <span className="px-2">:</span>
                    <span className="text-red-800 font-extrabold">{user.total_score2}</span>
                  </>
                ) : user.total_score === 0 ? (
                  ""
                ) : (
                  user.total_score
                )}
              </td>
              {user.problems?.map((problem, problemIndex) => (
                <td
                  key={problemIndex}
                  className="border py-2"
                  onDoubleClick={() =>
                    onClick(`/contest/${contestId}/problem/${problemIndex + 1}/user/${user.username}`)
                  }
                >
                  {contestType === 'Duel' ? (
                    <div>
                      {problem.score > user.problems2[problemIndex].score && problem.score > 0 ? (
                        <>
                          <div className="font-semibold text-blue-600">
                            {problem.score}
                          </div>
                          <span className="text-xs">{problem?.accepted_at}</span>
                        </>
                      ) : user.problems2[problemIndex].score > 0 ? (
                        <>
                          <div className="font-semibold text-red-600">
                            {user.problems2[problemIndex].score}
                          </div>
                          <span className="text-xs">{problem?.accepted_at}</span>
                        </>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ) : problem.score !== 0 ? (
                    <div>
                      <div
                        className={`font-semibold ${problem.score < 0 ? "text-gray-600" : "text-green-600"
                          }`}
                      >
                        {problem.score}
                      </div>
                      <span className="text-xs">{problem?.accepted_at}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="100%"
              className="py-6 text-center text-gray-600 bg-gray-100"
            >
              {t("contest.participants-not-found")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default function ContestStandings() {
  const { t, currentUser } = useStateContext();
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
    if (checkbox) url += "?unofficial=true";
    else url += "?unofficial=false";
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

  const toggleCheckbox = () => {
    setCheckbox((prev) => !prev);
  };

  useEffect(() => {
    getStandings();
  }, [checkbox]);

  if (loading) return <Loading />;

  if (!data.standings) return <NotFound />;

  return (
    <div>
      <StandingsUserSubmissions
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submissions={submissions}
        contestId={id}
        contestStartDate={data.contest.start_date}
      />
      <div className="text-center">
        <Link to={`/contest/${data.contest.id}`} className="text-2xl font-bold">
          {data.contest.name}
        </Link>
        <div>{t("contest.standings")}</div>
        <CountdownTimer
          dateString={data.contest.end_date}
          className="text-gray-400"
        />
      </div>
      <div className="overflow-x-auto">
        <CheckboxFilter checked={checkbox} onChange={toggleCheckbox} t={t} />
        <StandingsTable
          data={data}
          currentUser={currentUser}
          onClick={fetchSubmissions}
          contestId={id}
          contestType={data.contest.type}
          t={t}
        />
      </div>
    </div>
  );
}
