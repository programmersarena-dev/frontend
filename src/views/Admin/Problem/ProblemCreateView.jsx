import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  TagIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Textarea, Button, Input } from "@/components/ui";
import ProblemTags from "@/components/Problemset/ProblemTags";
import AdminPageHeader from "@/components/Admin/PageHeader";
import ReactCountryFlag from "react-world-flags";

const LANGUAGES = [
  { id: "tm", code: "TM", label: "Türkmençe" },
  { id: "en", code: "US", label: "English" },
  { id: "ru", code: "RU", label: "Русский" },
];

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-colors";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500">{label}</label>
    {children}
  </div>
);

export default function ProblemCreateView() {
  const { __ } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCasesFile, setTestCasesFile] = useState(null);

  const [problem, setProblem] = useState({
    tags: [],
    time_limit: 1, // seconds, shown in the UI — converted to ms on submit
    memory_limit: 256,
    // StoreProblemRequest validates score with min:500 — defaulting to 0
    // meant every fresh form failed validation on first submit.
    score: 500,
    difficulty: "",
    tm: { name: "", description: "", input: "", output: "", note: "" },
    en: { name: "", description: "", input: "", output: "", note: "" },
    ru: { name: "", description: "", input: "", output: "", note: "" },
  });

  // NOTE: ProblemTags is imported as a React component but is being called
  // here as a plain function and its return value JSON.parse'd — that's very
  // likely broken (a component call outside JSX returns React elements, not
  // a JSON string), and the surrounding try/catch would silently swallow the
  // resulting error, leaving `tags` permanently empty. Left as-is since I
  // don't have ProblemTags' source to know what it's actually meant to do —
  // share that file and I'll fix this properly.
  const tags = React.useMemo(() => {
    try {
      const parsed = JSON.parse(ProblemTags());
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const handleChange = (lang, field, value) => {
    setProblem((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTag = (tag) => {
    if (tag && !problem.tags.includes(tag)) {
      setProblem((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag) => {
    setProblem((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setTestCasesFile(e.target.files[0]);
    }
  };

  const onSaveClick = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("tags", JSON.stringify(problem.tags));

    // The `time_limit` column stores milliseconds as an integer
    // (StoreProblemRequest: required|integer; migration comment: "In
    // milliseconds"), but this field is shown to the admin in seconds
    // with decimal precision — convert before sending, or e.g. "1.5"
    // would previously have been sent as-is and either failed the
    // `integer` validation rule or, if it happened to be a whole number,
    // been stored as an absurdly small millisecond limit.
    formData.append("time_limit", Math.round(Number(problem.time_limit) * 1000));
    formData.append("memory_limit", problem.memory_limit);
    formData.append("score", problem.score);
    if (problem.difficulty !== "") {
      formData.append("difficulty", problem.difficulty);
    }

    // Turkmen
    formData.append("name", problem.tm.name);
    formData.append("description", problem.tm.description);
    formData.append("input", problem.tm.input);
    formData.append("output", problem.tm.output);
    formData.append("note", problem.tm.note);

    // English
    formData.append("name_en", problem.en.name);
    formData.append("description_en", problem.en.description);
    formData.append("input_en", problem.en.input);
    formData.append("output_en", problem.en.output);
    formData.append("note_en", problem.en.note);

    // Russian
    formData.append("name_ru", problem.ru.name);
    formData.append("description_ru", problem.ru.description);
    formData.append("input_ru", problem.ru.input);
    formData.append("output_ru", problem.ru.output);
    formData.append("note_ru", problem.ru.note);

    if (testCasesFile) {
      formData.append("test_cases", testCasesFile);
    }

    try {
      await axiosClient.post(`/admin/contest/${id}/problem/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/admin/contest/${id}/problems`);
    } catch (err) {
      console.error("Error adding problem:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
       <AdminPageHeader title={__("admin.problem.add_title")} />

      <div className="mt-6 space-y-6">
        {/* Card 1: Limits & Score */}
        <div className="border border-slate-100 rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <AdjustmentsHorizontalIcon className="h-4 w-4 text-slate-400" />
             <h3 className="text-sm font-semibold text-slate-900">{__("admin.problem.basic_settings")}</h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
             <Field label={__("admin.problem.time_limit")}>
              <input
                type="number"
                name="time_limit"
                step="0.1"
                min="0"
                value={problem.time_limit}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>

             <Field label={__("admin.problem.memory_limit")}>
              <input
                type="number"
                name="memory_limit"
                min="0"
                value={problem.memory_limit}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>

             <Field label={__("admin.problem.score")}>
              <input
                type="number"
                name="score"
                min="500"
                value={problem.score}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>

             <Field label={__("admin.problem.difficulty")}>
              <input
                type="number"
                name="difficulty"
                min="1"
                placeholder="—"
                value={problem.difficulty}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>
          </div>
        </div>

        {/* Card 2: Tags & Files */}
        <div className="border border-slate-100 rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <TagIcon className="h-4 w-4 text-slate-400" />
             <h3 className="text-sm font-semibold text-slate-900">{__("admin.problem.tags_files")}</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tag Selector */}
            <div>
               <label className="block text-xs font-medium text-slate-500">{__("admin.problem.tags")}</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-200 p-3 min-h-[46px]">
                {problem.tags.length === 0 ? (
                  <span className="text-xs text-slate-300 self-center">
                     {__("admin.problem.no_tags")}
                  </span>
                ) : (
                  problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-indigo-400 hover:text-indigo-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <select
                value=""
                onChange={(e) => {
                  addTag(e.target.value);
                  e.target.value = "";
                }}
                className={inputClass}
              >
                <option value="" disabled>
                   {__("admin.problem.select_tag")}
                </option>
                {tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Cases File Upload */}
            <div>
               <label className="block text-xs font-medium text-slate-500">{__("admin.problem.tests")}</label>
              <label className="mt-1.5 relative flex min-h-[105px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/20">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {testCasesFile ? (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-medium">{testCasesFile.name}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <ArrowUpTrayIcon className="mx-auto h-5 w-5 text-slate-300" />
                    <p className="mt-1 text-xs text-slate-400">
                       {__("admin.problem.upload_hint")}
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Multilingual Form Fields */}
        <div className="border border-slate-100 rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="h-4 w-4 text-slate-400" />
               <h3 className="text-sm font-semibold text-slate-900">{__("admin.problem.info")}</h3>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
              {LANGUAGES.map((lang) => {
                const isActive = activeTab === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveTab(lang.id)}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    <ReactCountryFlag
                      code={lang.code}
                      svg
                      style={{ width: "14px", height: "10px", borderRadius: "2px" }}
                    />
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keep forms rendered per tab so CKEditor DOM instances are not destroyed */}
          {LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className={activeTab === lang.id ? "space-y-5 block" : "hidden"}
            >
              <Input
                 text={__("admin.problem.name_label")}
                title={problem[lang.id].name}
                setTitle={(value) => handleChange(lang.id, "name", value)}
              />
              <Textarea
                 text={__("admin.problem.description_label")}
                description={problem[lang.id].description}
                setDescription={(value) => handleChange(lang.id, "description", value)}
              />
              <Textarea
                 text={__("admin.problem.input_label")}
                description={problem[lang.id].input}
                setDescription={(value) => handleChange(lang.id, "input", value)}
              />
              <Textarea
                 text={__("admin.problem.output_label")}
                description={problem[lang.id].output}
                setDescription={(value) => handleChange(lang.id, "output", value)}
              />
              <Textarea
                 text={__("admin.problem.note_label")}
                description={problem[lang.id].note}
                setDescription={(value) => handleChange(lang.id, "note", value)}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/admin/contest/${id}/problems`}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
             {__("admin.problem.cancel")}
          </Link>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSaveClick}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
             {isSubmitting ? __("admin.problem.saving") : __("admin.problem.save")}
          </button>
        </div>
      </div>
    </div>
  );
}