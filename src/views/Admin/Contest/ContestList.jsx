import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios";
import Loading from "../../../components/core/Loading";
import PaginationLinks from "../../../components/core/PaginationLinks";
import FormatToUTC from "../../../components/core/FormatToUTC";
import { CheckCircleIcon, ClockIcon, PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminComponent from "@/components/Admin/AdminComponent";

export default function ContestList() {
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [meta, setMeta] = useState({});
  const TABLE_HEAD = [
    "Görnüşi",
    "Ady",
    "Awtorlar",
    "Başlaýan wagty",
    "Dowamlylygy",
    "Ýagdaýy",
    "Meseleler",
    "Üýtget",
    "Poz",
    "Ulanyjylary duýdur",
    "Reýting ber",
  ];

  const onPageClick = (link) => {
    getContests(link.url);
  };

  const getContests = (url) => {
    url = url || "/admin/contests";
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

  const onDeleteClick = (id) => {
    if (window.confirm("Siz çyndanam pozmak isleýäňizmi?")) {
      setLoading(true);
      axiosClient
        .delete(`/admin/contest/${id}/delete`)
        .then((res) => {
          setContests(contests.filter((contest) => contest.id !== id));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
          return err;
        });
    }
  };

  const notifyUsers = (id) => {
    if (
      window.confirm("Are you sure you want to notify users for this contest?")
    ) {
      setLoading(true);
      axiosClient
        .post(`/admin/contest/${id}/notify`)
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
          return err;
        });
    }
  };

  const onGiveRateClick = (id) => {
    if (
      window.confirm("Siz çyndanam reýting beresiňiz gelýärmi?")
    ) {
      setLoading(true);
      axiosClient
        .get(`/admin/contest/${id}/add/ratings`)
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
          return err;
        });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminComponent>
      <div className="flex justify-between mb-6">
        <AdminPageHeader title="Bäsleşikler" />
        <Link
          to="/admin/contest/add"
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Bäsleşik goş
        </Link>
      </div>
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
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
        <tbody>
          {contests.map((contest, index) => (
            <tr key={index} className="hover:bg-gray-100 text-center">
              <td className="border-b border-gray-200 p-4">{contest.type}</td>
              <td className="border-b border-gray-200 p-4">{contest.name}</td>
              <td className="border-b border-gray-200 p-4">
                {contest.authorIds &&
                  contest.authorIds.length > 0 &&
                  contest.authorIds.map((author, index) => (
                    <p key={index}>{author}</p>
                  ))}
              </td>
              <td className="border-b border-gray-200 p-4">
                <FormatToUTC dateTime={contest.start_date} />
              </td>
              <td className="border-b border-gray-200 p-4">
                {contest.duration}
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                <ClockIcon className={`w-5 h-5 inline
                  ${contest.status === 'notStarted'
                    ? 'text-yellow-500'
                    : (contest.status === 'started'
                      ? 'text-green-500'
                      : 'text-red-500'
                    )
                  }`} />
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                <Link
                  to={`/admin/contest/${contest.id}/problems`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="w-5 h-5 inline" />
                </Link>
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                {contest.status === "past" ? (
                  <p className="text-blue-500">
                    <XCircleIcon className="w-5 h-5 inline" />
                  </p>
                ) : (
                  <Link
                    to={`/admin/contest/${contest.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </Link>
                )}
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                {contest.status === "past" ? (
                  <p className="text-red-500">
                    <XCircleIcon className="w-5 h-5 inline" />
                  </p>
                ) : (
                  <button
                    onClick={() => onDeleteClick(contest.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                )}
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                {contest.status === "past" ? (
                  <p className="text-red-500">
                    <XCircleIcon className="w-5 h-5 inline" />
                  </p>
                ) : (
                  <button
                    onClick={() => notifyUsers(contest.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <CheckCircleIcon className="w-5 h-5 inline" />
                  </button>
                )}
              </td>
              <td className="border-b border-gray-200 p-4 text-center">
                {contest.status === "past" ? (
                  <button
                    onClick={() => onGiveRateClick(contest.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <CheckCircleIcon className="w-5 h-5 inline" />
                  </button>
                ) : (
                  <p className="text-red-500">
                    <XCircleIcon className="w-5 h-5 inline" />
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Links */}
      {contests.length > 0 && (
        <PaginationLinks meta={meta} onPageClick={onPageClick} />
      )}
    </AdminComponent>
  );
}
