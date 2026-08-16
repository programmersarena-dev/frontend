import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormatToUTC from "@/components/core/FormatToUTC";
import axiosClient from "@/api/axios";
import ContestDetails from "@/components/Contest/ContestDetails";
import SubmissionStatus from "@/components/Submissions/SubmissionStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";
import {
  ArrowDownTrayIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  TagIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function ProblemSidebar({ setLoading, problem, submissions, contest }) {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || contest.acceptable_languages?.[0] || "");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser || !currentUser.name) {
      setLoading(false);
      addToast("Hasabyňyza giriň");
      return;
    }

    if (!currentUser.email_verified_at) {
      setLoading(false);
      addToast("Poçtaňyzy tassyklaň");
      return;
    }

    if (!file || !language) {
      setLoading(false);
      addToast("Faýl ýa-da dil saýlanylmady");
      return;
    }

    localStorage.setItem("selectedLanguage", language);

    axiosClient
      .post(
        `/submissions/problem/${problem?.code}/submit`,
        { file, language },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        addToast("Üstünlikli iberildi");
        navigate("/problemset/status");
      })
      .catch((err) => {
        addToast(err?.response?.data?.message || "Ýalňyşlyk ýüze çykdy");
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Contest Details Section */}
      {contest && <ContestDetails contest={contest} />}

      {/* Attachments Card */}
      {problem.attachment_url && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase">
            <PaperClipIcon className="h-4 w-4 text-slate-500" />
            {__("problem.attachments") || "Goşulmalar"}
          </h2>

          <a
            href={problem.attachment_url}
            download
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            <ArrowDownTrayIcon className="h-4 w-4 text-slate-500" />
            {__("problem.download") || "Ýükläp al"}
          </a>
        </div>
      )}

      {/* Submit Solution Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4"
      >
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase border-b border-slate-100 pb-3">
          <PaperAirplaneIcon className="h-4 w-4 text-emerald-600" />
          {__("problem.send") || "Çözgüt ibermek"}
        </h2>

        {/* Language Selection */}
        <div>
          <label
            htmlFor="language"
            className="block mb-1.5 text-xs font-medium text-slate-600 uppercase tracking-wider"
          >
            {__("problem.lang") || "Programlama dili"}
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
          >
            {contest.acceptable_languages &&
              contest.acceptable_languages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
          </select>
        </div>

        {/* File Input */}
        <div>
          <label
            htmlFor="file"
            className="block mb-1.5 text-xs font-medium text-slate-600 uppercase tracking-wider"
          >
            {__("problem.select-file") || "Faýly saýlaň"}
          </label>
          <input
            id="file"
            type="file"
            name="file"
            required
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl bg-slate-50/50 p-1.5 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
        >
          {__("problem.send") || "Iber"}
        </button>
      </form>

      {/* Last Submissions Section */}
      {submissions && submissions.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase border-b border-slate-100 pb-3">
            <ClockIcon className="h-4 w-4 text-slate-500" />
            {__("problem.last-submissions") || "Soňky synanyşyklar"}
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Header */}
            <div className="grid grid-cols-12 gap-1 font-semibold text-slate-400 pb-2 uppercase tracking-wider text-[10px]">
              <div className="col-span-2">#</div>
              <div className="col-span-4">{__("submission.nav-when") || "Wagty"}</div>
              <div className="col-span-3">{__("submission.nav-lang") || "Dil"}</div>
              <div className="col-span-3 text-right">{__("submission.nav-verdict") || "Nəticə"}</div>
            </div>

            {/* Submissions List */}
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="grid grid-cols-12 gap-1 items-center py-2.5 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition"
              >
                <div className="col-span-2 font-mono text-emerald-600 hover:underline">
                  <Link
                    to={`/contest/${submission.problem?.contest_id || contest?.id}/submission/${submission.id}`}
                  >
                    #{submission.id}
                  </Link>
                </div>
                <div className="col-span-4 text-slate-500 truncate">
                  <FormatToUTC dateTime={submission.created_at} />
                </div>
                <div className="col-span-3 font-medium text-slate-700 truncate">
                  {submission.language}
                </div>
                <div className="col-span-3 text-right">
                  <SubmissionStatus status={submission.status} className="text-[11px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problem Tags Section */}
      {problem?.tags && problem.tags.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase">
            <TagIcon className="h-4 w-4 text-slate-500" />
            {__("problem.tags") || "Tegler"}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/70 transition cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}