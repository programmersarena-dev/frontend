import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/core/Loading";
import ProfileMenu from "../../components/Profile/ProfileMenu";

export default function ProfileRatings() {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const { username } = useParams();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    axiosClient
      .get(`/profile/${username}/ratings`)
      .then(( res ) => {
        setRatings(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedContestRatings = () => {
    if (!ratings || !ratings.contest_ratings) {
      return [];
    }
    const sorted = [...ratings.contest_ratings];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                "ID",
                "Bäsleşik",
                "Ýeri",
                "Işlän mesele sany",
                "Reýting üýtgemesi",
                "Täze reýting",
              ].map((header, index) => (
                <th
                  key={index}
                  onClick={() =>
                    handleSort(header.toLowerCase().replace(" ", "_"))
                  }
                  className="px-4 py-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedContestRatings().map((userContest, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border-b border-gray-200">
                  {userContest.id}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  <a
                    href={`/contest/${userContest.contest.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {userContest.contest.name}
                  </a>
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {userContest.rank}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {userContest.solved}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {userContest.rating}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {userContest.new_rating}
                </td>
              </tr>
            ))}
            {!sortedContestRatings().length && (
              <tr className="text-center">
                <td
                  colSpan="6"
                  className="py-4 text-center bg-gray-200 text-gray-600"
                >
                  Bäsleşikler tapylmady.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
