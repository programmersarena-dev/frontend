import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSelector from "@/components/Contest/Submit/LanguageSelector";
import {
  CodeBracketIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function ContestSubmitView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [problems, setProblems] = useState([]);
  const [acceptableLanguages, setAcceptableLanguages] = useState([]);

  const [problemCode, setProblemCode] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [inputMode, setInputMode] = useState("code");

  useEffect(() => {
    if (!currentUser || !currentUser.name) {
      navigate("/login");
    } else if (!currentUser.email_verified_at) {
      navigate("/resend-verification-email");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    axiosClient
      .get(`/contests/${id}/submit`)
      .then((res) => {
        const fetchedProblems = res.data.problems || [];
        const fetchedLangs = res.data.acceptable_languages || [];

        setProblems(fetchedProblems);
        setAcceptableLanguages(fetchedLangs);
        setProblemCode(fetchedProblems[0]?.code ?? "");

        const savedLang = localStorage.getItem("selectedProgrammingLanguage");
        if (savedLang && fetchedLangs.includes(savedLang)) {
          setLanguage(savedLang);
        } else if (fetchedLangs.length > 0) {
          setLanguage(fetchedLangs[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching contest submit data:", error);
        addToast(__("contest.error-loading") || "Maglumatlary ýükläp bolmady");
      })
      .finally(() => setLoading(false));
  }, [id, addToast, __]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputMode === "file" && !file) {
      addToast(__("contest.select-file-required") || "Haýyş, faýl saýlaň");
      return;
    }

    if (inputMode === "code" && !code.trim()) {
      addToast(__("contest.code-required") || "Haýyş, kody giriziň");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("language", language);

    if (inputMode === "file" && file) {
      formData.append("file", file);
    } else {
      formData.append("code", code);
    }

    try {
      await axiosClient.post(`/submissions/problem/${problemCode}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addToast(__("contest.submitted-successfully") || "Üstünlikli iberildi");
      navigate("/problemset/status");
    } catch (err) {
      addToast(err.response?.data?.message || "Ýalňyşlyk ýüze çykdy");
      console.error("Failed to submit:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {__("contest.submit") || "Mesele çözgüdini ibermek"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {__("contest.submit-subtitle") || "Çözgüdiňizi faýl görnüşinde ýa-da kody göni girizip bilersiňiz."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="problem" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {__("contest.problem") || "Mesele"}
            </label>
            <select
              id="problem"
              value={problemCode}
              onChange={(e) => setProblemCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-all hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {problems.map((problem) => (
                <option key={problem.code} value={problem.code}>
                  {problem.char} — {problem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <LanguageSelector acceptable_languages={acceptableLanguages} language={language} setLanguage={setLanguage} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {__("contest.submission-method") || "Iberiş usuly"}
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setInputMode("code")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${inputMode === "code"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                <CodeBracketIcon className="h-3.5 w-3.5" />
                {__("contest.code") || "Kod"}
              </button>
              <button
                type="button"
                onClick={() => setInputMode("file")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${inputMode === "file"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                <DocumentArrowUpIcon className="h-3.5 w-3.5" />
                {__("contest.choose-file") || "Faýl saýla"}
              </button>
            </div>
          </div>

          {inputMode === "code" && (
            <div className="relative rounded-2xl border border-slate-200 bg-slate-900 p-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/30">
              <textarea
                id="code"
                rows="10"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste or write your source code here..."
                className="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          )}

          {inputMode === "file" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-all hover:bg-slate-50">
              {!file ? (
                <label htmlFor="file" className="cursor-pointer space-y-2">
                  <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-slate-400" />
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600 hover:underline">
                      {__("contest.click-to-upload") || "Faýl saýlamak üçin basyň"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    .cpp, .java, .py, .pas, .go, .rs
                  </p>
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <DocumentArrowUpIcon className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <p className="max-w-xs truncate text-xs font-semibold text-slate-800">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? (
            <span>{__("contest.sending") || "Iberilýär..."}</span>
          ) : (
            <>
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>{__("contest.send") || "Iber"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}