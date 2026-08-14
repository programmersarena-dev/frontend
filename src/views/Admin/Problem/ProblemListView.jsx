import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
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
    "Jemi çözüwler",
    "Nädogry çözüwler",
    "Çözen ulanyjylar",
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
        const message =
          err?.response?.data?.message || "Näbelli säwlik ýüze çykdy.";
        addToast(message);
        console.error("Error fetching problems:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const recheckAllSubmissions = (char) => {
    if (
      window.confirm(
        "Are you sure you want to recheck all submissions for this problem?"
      )
    ) {
      setLoading(true);
      axiosClient
        .post(`/admin/contest/${id}/problem/${char}/recheck-all-submissions`)
        .then(() => {
          addToast("Çözüwleri täzeden barlag işe goýberildi.");
        })
        .catch((err) => {
          const message =
            err?.response?.data?.message || "Näbelli säwlik ýüze çykdy.";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <AdminPageHeader title="Meseleler" />

        <div className="flex items-center space-x-2.5">
          <Link
            to="/admin/contests"
            className="inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1.5 text-slate-500" />
            Yza
          </Link>

          <Link
            to={`/admin/contest/${id}/problem/add`}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-sm active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Mesele goş
          </Link>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5 text-center w-16">
                  {TABLE_HEAD[0]}
                </th>
                <th scope="col" className="py-3.5 px-5">
                  {TABLE_HEAD[1]}
                </th>
                <th scope="col" className="py-3.5 px-5 text-center">
                  {TABLE_HEAD[2]}
                </th>
                <th scope="col" className="py-3.5 px-5 text-center">
                  {TABLE_HEAD[3]}
                </th>
                <th scope="col" className="py-3.5 px-5 text-center">
                  {TABLE_HEAD[4]}
                </th>
                <th scope="col" className="py-3.5 px-5 text-right pr-6">
                  {TABLE_HEAD[5]}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {problems.length > 0 ? (
                problems.map((problem) => (
                  <tr
                    key={problem.char}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Character Badge */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 font-mono font-bold text-slate-800 text-xs border border-slate-200/60">
                        {problem.char}
                      </span>
                    </td>

                    {/* Problem Name */}
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {problem.name}
                    </td>

                    {/* Total Submissions */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100/80 text-slate-700">
                        <DocumentTextIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{problem.submissions_count ?? 0}</span>
                      </span>
                    </td>

                    {/* Wrong Submissions */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700">
                        <XCircleIcon className="h-3.5 w-3.5 text-rose-400" />
                        <span>{problem.wrong_submissions_count ?? 0}</span>
                      </span>
                    </td>

                    {/* Accepted Submissions */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                        <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{problem.accepted_submissions_count ?? 0}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => recheckAllSubmissions(problem.char)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Submissiýalary täzeden barlat"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/contest/${id}/problem/${problem.char}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Üýtget"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDeleteClick(problem.char)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Poz"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <InboxIcon className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-medium text-slate-600">
                        Meseleler tapylmady.
                      </span>
                      <p className="text-xs text-slate-400">
                        Täze mesele goşmak üçin ýokardaky düwmä basyň.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}