import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import { useToast } from "@/contexts/ToastContext";
import AdminPageHeader from "@/components/Admin/PageHeader";

export default function ProblemListView() {
  const { addToast } = useToast();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);

  const TABLE_HEAD = [
    "#",
    "Ady",
    "Jemi cozuwler",
    "Nädogry cozuwler",
    "Çözen ulanyjylaryň sany",
    "Amallar",
  ];

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/admin/contest/${id}/problems`)
      .then((res) => {
        setProblems(res.data.data || []);
      })
      .catch((err) => {
        const message = err?.response?.data?.message || "Näbelli säwlik ýüze çykdy.";
        addToast(message);
        console.error("Error fetching problems:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const recheckAllSubmissions = (char) => {
    if (window.confirm("Are you sure you want to recheck all submissions for this problem?")) {
      setLoading(true);
      axiosClient
        .post(`/admin/contest/${id}/problem/${char}/recheck-all-submissions`)
        .then(() => {
          addToast("Cozuwleri täzeden barlagy işe goýberildi.");
        })
        .catch((err) => {
          const message = err?.response?.data?.message || "Näbelli säwlik ýüze çykdy.";
          addToast(message);
          console.error("Error rechecking submissions:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onDeleteClick = (char) => {
    if (!window.confirm("Siz çyndanam meseläni pozmak isleýäňizmi?")) return;

    setLoading(true);
    axiosClient
      .delete(`/admin/contest/${id}/problem/${char}/delete`)
      .then(() => {
        setProblems((prev) => prev.filter((problem) => problem.char !== char));
        addToast("Mesele üstünlikli pozuldy.");
      })
      .catch((err) => {
        const message = err?.response?.data?.message || "Meseläni pozup bolmady.";
        addToast(message);
        console.error("Error deleting problem:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <AdminPageHeader title="Meseleler" />

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/contests"
              className="inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2 text-slate-500" />
              Yza
            </Link>

            <Link
              to={`/admin/contest/${id}/problem/add`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Mesele goş
            </Link>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-6 text-center w-16">
                    {TABLE_HEAD[0]}
                  </th>
                  <th scope="col" className="py-3.5 px-6">
                    {TABLE_HEAD[1]}
                  </th>
                  <th scope="col" className="py-3.5 px-6 text-center">
                    {TABLE_HEAD[2]}
                  </th>
                  <th scope="col" className="py-3.5 px-6 text-center">
                    {TABLE_HEAD[3]}
                  </th>
                  <th scope="col" className="py-3.5 px-6 text-center">
                    {TABLE_HEAD[4]}
                  </th>
                  <th scope="col" className="py-3.5 px-6 text-center">
                    {TABLE_HEAD[5]}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {problems.length > 0 ? (
                  problems.map((problem) => (
                    <tr
                      key={problem.char}
                      className="hover:bg-slate-50/60 transition-colors duration-150"
                    >
                      {/* Character Badge */}
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-slate-100 font-semibold text-slate-700 text-xs">
                          {problem.char}
                        </span>
                      </td>

                      {/* Problem Name */}
                      <td className="py-3.5 px-6 font-medium text-slate-900">
                        {problem.name}
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{problem.submissions_count ?? 0}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{problem.wrong_submissions_count ?? 0}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{problem.accepted_submissions_count ?? 0}</span>
                        </span>
                      </td>

                      {/* Edit Action */}
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => recheckAllSubmissions(problem.char)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Submssiýalary täzeden barlat"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/contest/${id}/problem/${problem.char}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Üýtget"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDeleteClick(problem.char)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Poz"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <DocumentTextIcon className="w-8 h-8 text-slate-300" />
                        <span className="text-sm font-medium">Meseleler tapylmady.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}