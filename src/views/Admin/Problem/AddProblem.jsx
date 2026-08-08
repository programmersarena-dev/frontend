import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import { 
  XMarkIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon,
  TagIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon
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

export default function AddProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCasesFile, setTestCasesFile] = useState(null);

  const [problem, setProblem] = useState({
    tags: [],
    time_limit: 1,
    memory_limit: 256,
    score: 0,
    tm: { name: "", description: "", input: "", output: "", note: "" },
    en: { name: "", description: "", input: "", output: "", note: "" },
    ru: { name: "", description: "", input: "", output: "", note: "" },
  });

  // Safely parse available tags
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
    formData.append("time_limit", problem.time_limit);
    formData.append("memory_limit", problem.memory_limit);
    formData.append("score", problem.score);

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
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-slate-200 pb-5">
          <AdminPageHeader title="Mesele goş" />
        </div>

        <div className="space-y-8">
          {/* Card 1: Limits & Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Esasy sazlamalar
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Wagt çäklendirmesi (s)
                </label>
                <input
                  type="number"
                  name="time_limit"
                  step="0.1"
                  value={problem.time_limit}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Ýat çäklendirmesi (MB)
                </label>
                <input
                  type="number"
                  name="memory_limit"
                  value={problem.memory_limit}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Bal / Çylşyrymlylyk
                </label>
                <input
                  type="number"
                  name="score"
                  value={problem.score}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Tags & Files */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TagIcon className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-800">
                Tegler we Test Faýllary
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Tag Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Tegler
                </label>
                <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/30 p-3 min-h-[46px]">
                  {problem.tags.length === 0 ? (
                    <span className="text-xs text-slate-400 self-center">
                      Hiç hili teg saýlanmady
                    </span>
                  ) : (
                    problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded p-0.5 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="mt-3">
                  <select
                    value=""
                    onChange={(e) => {
                      addTag(e.target.value);
                      e.target.value = "";
                    }}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="" disabled>
                      + Teg saýla
                    </option>
                    {tags.map((tag, index) => (
                      <option key={index} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Test Cases File Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Testler (.zip)
                </label>
                <div className="mt-2">
                  <label className="relative flex min-h-[105px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50/20">
                    <input
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    {testCasesFile ? (
                      <div className="flex items-center space-x-2 text-emerald-700">
                        <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                        <span className="text-sm font-medium">
                          {testCasesFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ArrowUpTrayIcon className="mx-auto h-6 w-6 text-slate-400" />
                        <p className="mt-1 text-xs text-slate-600">
                          ZIP faýly saýlaň ýa-da bu ýere geçiriň
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Multilingual Form Fields */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-800">
                  Mesele Barada Maglumat
                </h3>
              </div>

              {/* Language Switcher Tabs */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                {LANGUAGES.map((lang) => {
                  const isActive = activeTab === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveTab(lang.id)}
                      className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ReactCountryFlag
                        code={lang.code}
                        svg
                        style={{ width: "16px", height: "12px", borderRadius: "2px" }}
                      />
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Multilingual Form Inputs */}
            <div className="space-y-6">
              <Input
                text="Ady"
                title={problem[activeTab].name}
                setTitle={(value) => handleChange(activeTab, "name", value)}
              />
              <Textarea
                text="Mazmun"
                description={problem[activeTab].description}
                setDescription={(value) => handleChange(activeTab, "description", value)}
                activeTab={activeTab}
              />
              <Textarea
                text="Giriş verileri (Input)"
                description={problem[activeTab].input}
                setDescription={(value) => handleChange(activeTab, "input", value)}
                activeTab={activeTab}
              />
              <Textarea
                text="Çykyş verileri (Output)"
                description={problem[activeTab].output}
                setDescription={(value) => handleChange(activeTab, "output", value)}
                activeTab={activeTab}
              />
              <Textarea
                text="Bellik (Note)"
                description={problem[activeTab].note}
                setDescription={(value) => handleChange(activeTab, "note", value)}
                activeTab={activeTab}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <Link
              to={`/admin/contest/${id}/problems`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Goýbolsun
            </Link>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSaveClick}
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {isSubmitting ? "Goşulýar..." : "Goş"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}