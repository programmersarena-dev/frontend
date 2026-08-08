import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminContestOfficialCheckBox from "@/components/Admin/AdminContestOfficialCheckBox";
import AdminContestTypeList from "@/components/Admin/AdminContestTypeList";
import Loading from "@/components/core/Loading";
import AdminContestAuthorList from "@/components/Admin/AdminContestAuthorList";

export default function AddContest() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [contestTypes, setContestTypes] = useState([]);
  const [contest, setContest] = useState({
    type: "",
    name: "",
    authors: [],
    start_date: "",
    duration: "",
    participants: {
      official: [], unofficial: []
    },
    official: false,
    active: false,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContest({
      ...contest,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const onSaveClick = () => {
    setLoading(true);
    axiosClient
      .post("/admin/contest/add", contest)
      .then(() => {
        navigate("/admin/contests");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  const onCancelClick = () => {
    navigate("/admin/contests");
  };

  useEffect(() => {
    Promise.all([
      axiosClient.get("/admin/users"),
      axiosClient.get("/admin/contest-types"),
    ])
      .then(([usersRes, contestTypesRes]) => {
        setUsers(usersRes.data);
        setContestTypes(contestTypesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="p-8 min-h-screen">
        <div className="flex justify-between mb-6">
          <AdminPageHeader title="Bäsleşik goş" />
          <h3 className="text-2xl font-bold"></h3>
        </div>
        <div className="space-y-6">

          <AdminContestTypeList contest={contest} setContest={setContest} contestTypes={contestTypes} />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ady:
            </label>
            <input
              type="text"
              name="name"
              value={contest.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Bäsleşigiň ady"
            />
          </div>

          <AdminContestAuthorList
            users={users}
            contest={contest}
            setContest={setContest}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Başlaýan wagty (UTC):
            </label>
            <input
              type="datetime-local"
              name="start_date"
              value={contest.start_date}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dowamlylygy (HH:MM):
            </label>
            <input
              type="text"
              name="duration"
              value={contest.duration}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="HH:MM"
            />
          </div>

          <AdminContestOfficialCheckBox contest={contest} setContest={setContest} users={users} handleInputChange={handleInputChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Işjeň:
            </label>
            <input
              type="checkbox"
              name="active"
              checked={contest.active}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onCancelClick}
              className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Goýbolsun
            </button>
            <button
              type="button"
              onClick={onSaveClick}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Goş
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
