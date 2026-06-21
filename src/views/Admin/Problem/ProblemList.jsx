import React, { useEffect, useState } from "react";
import Loading from "@/components/core/Loading";
import { Link, useParams } from "react-router-dom";
import axiosClient from "@/axios";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useStateContext } from "@/contexts/ContextProvider";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminComponent from "@/components/Admin/AdminComponent";

export default function ProblemList() {
  const { showToast } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const { id } = useParams();
  const TABLE_HEAD = ["#", "Ady", "Çözen ulanyjylaryň sany", "Üýtget", "Poz"];

  useEffect(() => {
    axiosClient
      .get(`/admin/contest/${id}/problems`)
      .then((res) => {
        setProblems(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.response.data.message);
        console.error("Error fetching contests:", err);
        setLoading(false);
      });
  }, [id]);

  const onDeleteClick = (id, char) => {
    if (window.confirm("Siz çyndanam meseläni pozmak isleýäňizmi?")) {
      setLoading(true);
      axiosClient
        .delete(`/admin/contest/${id}/problem/${char}/delete`)
        .then((res) => {
          setProblems(problems.filter((problem) => problem.char !== char));
          setLoading(false);
        })
        .catch((err) => {
          showToast(err.response.data.message);
          console.error("Error:", err);
          setLoading(false);
          return err;
        });
    }
  };

  if (loading) return <Loading />;

  return (
    <AdminComponent>
      <div className="p-8 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <AdminPageHeader title="Meseleler" />
          <div className="flex space-x-4">
            <Link
              to={`/admin/contests`}
              className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Yza
            </Link>
            <Link
              to={`/admin/contest/${id}/problem/add`}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Mesele goş
            </Link>
          </div>
        </div>

        <table className="w-full min-w-max table-auto bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-gray-600 px-6 py-3 text-sm font-semibold text-center"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problems.length > 0 &&
              problems.map((problem, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-center transition-colors duration-200"
                >
                  <td className="py-3 px-6 border-b border-gray-200">
                    {problem.char}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    {problem.name}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 mr-1 text-gray-500" />
                    {problem.accepted_submissions}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    <Link
                      to={`/admin/contest/${id}/problem/${problem.char}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </Link>
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    <button
                      onClick={() => onDeleteClick(id, problem.char)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            {problems.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-4 text-center bg-gray-200 text-gray-600"
                >
                  Meseleler tapylmady.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminComponent>
  );
}
