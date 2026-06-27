import { useEffect, useState } from "react";
import Loading from "../../components/core/Loading";
import axiosClient from "@/api/axios";
import { useParams } from "react-router-dom";
import ProblemItem from "../../components/Contest/ProblemItem";
import ContestDetails from "../../components/Contest/ContestDetails";

export default function ContestProblems() {
  const [loading, setLoading] = useState(true);
  const TABLE_HEAD = ["#", "Ady", ""];
  const [problems, setProblems] = useState([]);
  const [contest, setContest] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axiosClient
      .get(`/contest/${id}/problems`)
      .then((res) => {
        setProblems(res.data.problems);
        setContest(res.data.contest);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={index}
                      className="border-b border-gray-600 px-6 py-3 text-sm font-semibold text-center"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <ProblemItem key={problem.id} index={index} problem={problem} contestId={id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-8 text-center">
          <ContestDetails contest={contest} />
        </div>
      </div>
    </div>
  );
}
