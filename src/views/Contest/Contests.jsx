import { useEffect, useState } from "react";
import Loading from "../../components/core/Loading";
import axiosClient from "../../axios";
import ContestItem from "../../components/Contest/ContestItem";
import PaginationLinks from "../../components/core/PaginationLinks";
import { useStateContext } from "../../contexts/ContextProvider";

export default function Contests() {
  const { t } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState({});
  const [meta, setMeta] = useState({});
  const TABLE_HEAD = [
    t("contest.type"),
    t("contest.name"),
    t("contest.authors"),
    t("contest.start-time"),
    t("contest.duration"),
    t("contest.status"),
    t("contest.participants"),
  ];

  const onPageClick = (link) => {
    getContests(link.url);
  };

  const getContests = (url) => {
    url = url || "/contests";
    axiosClient
      .get(url)
      .then((response) => {
        setContests(response.data.data);
        setMeta(response.data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
        return error;
      });
  };

  useEffect(() => {
    getContests();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="container mx-auto overflow-x-auto">
        {contests.length > 0 && contests.filter((item) => item.status !== "ended").length > 0 && (
          <>
            <div className="text-xl font-bold m-4">{t("contest.upcoming-contests")}</div>
            <table className="w-full min-w-max table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={index}
                      className="border-b border-gray-300 p-4 text-sm font-semibold text-center"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              {[...contests]
                .reverse()
                .filter(contest => contest.status !== "ended")
                .map((contest, index) => (
                  <tbody key={index}>
                    <ContestItem contest={contest} index={index} />
                  </tbody>
                ))}
            </table>
          </>
        )}

        {contests.length > 0 && contests.filter((item) => item.status === "ended").length > 0 && (
          <>
            <div className="text-xl font-bold m-4">{t("contest.finished-contests")}</div>
            <table className="w-full min-w-max table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={index}
                      className="border-b border-gray-300 p-4 text-sm font-semibold text-center"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              {contests.map((contest, index) => (
                <tbody key={index}>
                  {contest.status == "ended" && (
                    <ContestItem contest={contest} index={index} />
                  )}
                </tbody>
              ))}
            </table>
          </>
        )}
      </div>

      {/* Pagination Links */}
      {contests.length > 0 && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </div>
  );
}
