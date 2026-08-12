import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminContestOfficialCheckBox from "@/components/Admin/AdminContestOfficialCheckBox";
import AdminContestTypeList from "@/components/Admin/AdminContestTypeList";
import Loading from "@/components/core/Loading";
import AdminContestAuthorList from "@/components/Admin/AdminContestAuthorList";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-colors";

const Field = ({ label, htmlFor, hint, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-500">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

export default function ContestCreateView() {
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

  // Duration is edited as separate hours/minutes fields for usability, but
  // the API validates `duration` as an "H:i" string (StoreContestRequest:
  // required|date_format:H:i) — so that's the wire format, not minutes.
  const [durH, durM] = (contest.duration || "0:00").split(":").map(Number);
  const durationHours = Number.isFinite(durH) ? durH : 0;
  const durationRemainder = Number.isFinite(durM) ? durM : 0;

  const pad = (n) => String(n).padStart(2, "0");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContest({
      ...contest,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDurationPartChange = (part) => (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    const hours = part === "hours" ? value : durationHours;
    const minutes = part === "minutes" ? Math.min(59, value) : durationRemainder;
    setContest({ ...contest, duration: `${pad(hours)}:${pad(minutes)}` });
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
    <div className="max-w-2xl">
      <AdminPageHeader title="Bäsleşik goş" />

      <div className="mt-6 border border-slate-100 rounded-2xl p-6 space-y-5">
        <AdminContestTypeList contest={contest} setContest={setContest} contestTypes={contestTypes} />

        <Field label="Ady" htmlFor="name">
          <input
            id="name"
            type="text"
            name="name"
            value={contest.name}
            onChange={handleInputChange}
            className={inputClass}
            placeholder="Bäsleşigiň ady"
          />
        </Field>

        <AdminContestAuthorList
          users={users}
          contest={contest}
          setContest={setContest}
        />

        <Field
          label="Başlaýan wagty"
          htmlFor="start_date"
          hint="Brauzeriňiziň ýerli wagt zolagy boýunça girizilýär."
        >
          <input
            id="start_date"
            type="datetime-local"
            name="start_date"
            value={contest.start_date}
            onChange={handleInputChange}
            min={new Date().toISOString().slice(0, 16)}
            className={inputClass}
          />
        </Field>

        <Field label="Dowamlylygy">
          <div className="mt-1.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={durationHours}
                onChange={handleDurationPartChange("hours")}
                className={`${inputClass} mt-0 w-20 text-center font-mono`}
              />
              <span className="text-xs text-slate-400">sagat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="59"
                value={durationRemainder}
                onChange={handleDurationPartChange("minutes")}
                className={`${inputClass} mt-0 w-20 text-center font-mono`}
              />
              <span className="text-xs text-slate-400">minut</span>
            </div>
          </div>
        </Field>

        <AdminContestOfficialCheckBox
          contest={contest}
          setContest={setContest}
          users={users}
          handleInputChange={handleInputChange}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            id="active"
            type="checkbox"
            name="active"
            checked={contest.active}
            onChange={handleInputChange}
            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-0"
          />
          <label htmlFor="active" className="text-xs font-medium text-slate-600">
            Işjeň
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancelClick}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Goýbolsun
          </button>
          <button
            type="button"
            onClick={onSaveClick}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Goş
          </button>
        </div>
      </div>
    </div>
  );
}