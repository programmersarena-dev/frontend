import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-colors";

const Field = ({ label, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-500">
      {label}
    </label>
    {children}
  </div>
);

export default function ContestSubmitView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [problems, setProblems] = useState([]);
  const [acceptableLanguages, setAcceptableLanguages] = useState([]);
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [problemChar, setProblemChar] = useState("A");
  const { id } = useParams();
  const navigate = useNavigate();

  // Auth redirects belong in an effect, not directly in the render path —
  // calling navigate() while rendering is an unsafe pattern (React keeps
  // evaluating the rest of this render pass regardless), and it also ran
  // on every single render rather than only when auth state changes.
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
        setProblems(res.data.problems);
        setAcceptableLanguages(res.data.acceptable_languages);
        setLanguage(res.data.acceptable_languages[0]);
        setProblemChar(res.data.problems?.[0]?.char ?? "A");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file && !code.trim()) {
      addToast(__("contest.submit-code-or-file-required") || "Kod ýazyň ýa-da faýl saýlaň");
      return;
    }

    setSubmitting(true);

    // Was posting a plain object with a hand-set multipart header, which
    // does not actually multipart-encode anything — a real FormData
    // instance is required for the body to be encoded correctly.
    const formData = new FormData();
    formData.append("language", language);
    // File and pasted code are presented as alternatives ("or choose
    // file"); only send whichever one the user actually used instead of
    // always sending both.
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("code", code);
    }

    axiosClient
      .post(`/problemset/problem/${id}/${problemChar}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        addToast(__("contest.submitted-successfully") || "Üstünlikli iberildi");
        navigate("/problemset/status");
      })
      .catch((err) => {
        addToast(err.response?.data?.message || "Ýalňyşlyk ýüze çykdy");
        console.error("Failed to submit:", err);
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        {__("contest.submit")}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label={__("contest.problem")} htmlFor="problem">
          <select
            name="problem"
            id="problem"
            value={problemChar}
            className={inputClass}
            onChange={(e) => setProblemChar(e.target.value)}
          >
            {problems.map((problem, index) => (
              <option value={problem.char} key={index}>
                {problem.char} — {problem.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label={__("contest.language")} htmlFor="language">
          <select
            name="language"
            id="language"
            value={language}
            className={inputClass}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {acceptableLanguages.map((acceptableLanguage, index) => (
              <option key={index} value={acceptableLanguage}>
                {acceptableLanguage}
              </option>
            ))}
          </select>
        </Field>

        <Field label={__("contest.code")} htmlFor="code">
          <textarea
            name="code"
            id="code"
            rows="8"
            placeholder={file ? __("contest.file-selected-below") || "Faýl saýlandy" : ""}
            disabled={!!file}
            value={code}
            className={`${inputClass} font-mono disabled:bg-slate-50 disabled:text-slate-300`}
            onChange={(e) => setCode(e.target.value)}
          />
        </Field>

        <Field label={__("contest.or-choose-file")} htmlFor="file">
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="file"
              id="file"
              name="file"
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-600 hover:file:bg-slate-100"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors shrink-0"
              >
                {__("contest.clear") || "Aýyr"}
              </button>
            )}
          </div>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {submitting ? __("contest.sending") || "Iberilýär..." : __("contest.send")}
        </button>
      </form>
    </div>
  );
}