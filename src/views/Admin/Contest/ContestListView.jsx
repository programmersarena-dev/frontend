import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import Loading from "../../../components/core/Loading";
import PaginationLinks from "../../../components/core/PaginationLinks";
import FormatToUTC from "../../../components/core/FormatToUTC";
import {
  BellIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  StarIcon,
  DocumentTextIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AdminPageHeader from "@/components/Admin/PageHeader";

export default function ContestList() {
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState({});

  const TABLE_HEAD = [
    { label: "Görnüşi", align: "text-left" },
    { label: "Ady", align: "text-left" },
    { label: "Awtorlar", align: "text-left" },
    { label: "Başlaýan wagty", align: "text-center" },
    { label: "Dowamlylygy", align: "text-center" },
    { label: "Ýagdaýy", align: "text-center" },
    { label: "Meseleler", align: "text-center" },
    { label: "Amallar", align: "text-right" },
  ];

  const onPageClick = (link) => {
    getContests(link.url);
  };

  const getContests = (url) => {
    url = url || "/admin/contests";
    setLoading(true);
    axiosClient
      .get(url)
      .then((response) => {
        setContests(response.data.data || []);
        setMeta(response.data.meta || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getContests();
  }, []);

  const onDeleteClick = (id) => {
    if (window.confirm("Siz çyndanam pozmak isleýäňizmi?")) {
      setLoading(true);
      axiosClient
        .delete(`/admin/contest/${id}/delete`)
        .then(() => {
          setContests(contests.filter((contest) => contest.id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  };

  const notifyUsers = (id) => {
    if (window.confirm("Are you sure you want to notify users for this contest?")) {
      setLoading(true);
      axiosClient
        .post(`/admin/contest/${id}/notify`)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  };

  const onGiveRateClick = (id) => {
    if (window.confirm("Siz çyndanam reýting beresiňiz gelýärmi?")) {
      setLoading(true);
      axiosClient
        .get(`/admin/contest/${id}/add/ratings`)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "started":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Başlandy
          </span>
        );
      case "notStarted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Başlamady
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Gutardy
          </span>
        );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header & Primary Action */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
          <AdminPageHeader title="Bäsleşikler" />
          <Link
            to="/admin/contest/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <PlusIcon className="h-4 w-4 stroke-[2.5]" />
            <span>Bäsleşik goş</span>
          </Link>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {TABLE_HEAD.map((head, index) => (
                    <th key={index} className={`px-4 py-3.5 ${head.align}`}>
                      {head.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {contests.map((contest) => {
                  const isPast = contest.status === "past" || contest.status === "ended";

                  return (
                    <tr
                      key={contest.id}
                      className="hover:bg-slate-50/60 transition-colors duration-150"
                    >
                      {/* Type */}
                      <td className="px-4 py-4 font-medium text-slate-900">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {contest.type}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4 font-semibold text-slate-900 max-w-xs truncate">
                        {contest.name}
                      </td>

                      {/* Authors */}
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {contest.authorIds && contest.authorIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {contest.authorIds.map((author, idx) => (
                              <span
                                key={idx}
                                className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-slate-600"
                              >
                                {author}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-4 text-center text-xs font-mono text-slate-600">
                        <FormatToUTC dateTime={contest.start_date} />
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-4 text-center text-xs text-slate-600 font-mono">
                        {contest.duration}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(contest.status)}
                      </td>

                      {/* Problems */}
                      <td className="px-4 py-4 text-center">
                        <Link
                          to={`/admin/contest/${contest.id}/problems`}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Meseleler"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                        </Link>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Notify Button */}
                          {!isPast && (
                            <button
                              onClick={() => notifyUsers(contest.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Ulanyjylary duýdur"
                            >
                              <BellIcon className="h-4 w-4" />
                            </button>
                          )}

                          {/* Give Rating Button */}
                          {isPast && (
                            <button
                              onClick={() => onGiveRateClick(contest.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Reýting ber"
                            >
                              <StarIcon className="h-4 w-4" />
                            </button>
                          )}

                          {/* Edit Button */}
                          {!isPast ? (
                            <Link
                              to={`/admin/contest/${contest.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Üýtget"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Link>
                          ) : null}

                          {/* Delete Button */}
                          {!isPast ? (
                            <button
                              onClick={() => onDeleteClick(contest.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Poz"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {contests.length === 0 && (
          <div className="mx-auto my-12 max-w-md rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white/50">
            <TrophyIcon className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              Bäsleşik tapylmady
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Täze bäsleşik goşmak üçin ýokardaky düwmä basyň.
            </p>
          </div>
        )}

        {/* Pagination */}
        {contests.length > 0 && (
          <div className="pt-2">
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          </div>
        )}
      </div>
    </>
  );
}