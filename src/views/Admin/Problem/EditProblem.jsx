import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import { XMarkIcon, ArrowDownTrayIcon, TagIcon, FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { Textarea, Input } from "@/components/ui";
import Loading from "@/components/core/Loading";
import ProblemTags from "@/components/Problemset/ProblemTags";
import { useToast } from "@/contexts/ToastContext";
import AdminPageHeader from "@/components/Admin/PageHeader";
import ReactCountryFlag from "react-world-flags";

export default function EditProblem() {
  const { addToast } = useToast();
  const { id, char } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tm");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [problem, setProblem] = useState({
    tags: [],
    time_limit: 1,
    memory_limit: 256,
    score: 0,
    test_cases: null,
    tm: { name: "", description: "", input: "", output: "", note: "" },
    en: { name: "", description: "", input: "", output: "", note: "" },
    ru: { name: "", description: "", input: "", output: "", note: "" },
  });

  const availableTags = JSON.parse(ProblemTags() || "[]");

  useEffect(() => {
    axiosClient
      .get(`/admin/contest/${id}/problem/${char}`)
      .then(({ data }) => {
        setProblem({
          tags: data.tags || [],
          time_limit: data.time_limit ?? 1,
          memory_limit: data.memory_limit ?? 256,
          score: data.score ?? 0,
          test_cases: null,
          tm: { name: data.name || "", description: data.description || "", input: data.input || "", output: data.output || "", note: data.note || "" },
          en: { name: data.name_en || "", description: data.description_en || "", input: data.input_en || "", output: data.output_en || "", note: data.note_en || "" },
          ru: { name: data.name_ru || "", description: data.description_ru || "", input: data.input_ru || "", output: data.output_ru || "", note: data.note_ru || "" },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading problem data:", err);
        setLoading(false);
      });
  }, [id, char]);

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

  const onSaveClick = () => {
    setSaving(true);
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

    if (problem.test_cases) {
      formData.append("test_cases", problem.test_cases);
    }

    axiosClient
      .post(`/admin/contest/${id}/problem/${char}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        addToast(res.data.message);
        navigate(`/admin/contest/${id}/problems`);
      })
      .catch((err) => {
        console.error("Error updating problem:", err);
      })
      .finally(() => setSaving(false));
  };

  const handleTestCaseDownload = () => {
    axiosClient({
      url: `/admin/contest/${id}/problem/${char}/download-test-cases`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${id}_${char}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading test cases:", error);
        alert("Failed to download test cases.");
      });
  };

  if (loading) return <Loading />;

  const languages = [
    { code: "tm", country: "TM", label: "Türkmen" },
    { code: "en", country: "US", label: "English" },
    { code: "ru", country: "RU", label: "Русский" },
  ];

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <AdminPageHeader title={`Meseläni üýtget (${char})`} />
        </div>

        <div className="space-y-8">
          {/* Card 1: Technical Configurations & Limits */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-800">Parameters & Limits</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Wagt çägi (s)
                </label>
                <input
                  type="number"
                  name="time_limit"
                  step="0.1"
                  value={problem.time_limit}
                  onChange={handleInputChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Ýat çägi (MB)
                </label>
                <input
                  type="number"
                  name="memory_limit"
                  value={problem.memory_limit}
                  onChange={handleInputChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Bal / Çylşyrymlylyk
                </label>
                <input
                  type="number"
                  name="score"
                  value={problem.score}
                  onChange={handleInputChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Tags & Test Cases */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tags */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <TagIcon className="h-4 w-4 text-slate-400" /> Tegler
                </label>
                <div className="mt-3 flex flex-wrap gap-1.5 min-h-[38px] rounded-xl border border-dashed border-slate-200 p-2">
                  {problem.tags.length === 0 && (
                    <span className="text-xs text-slate-400 self-center px-1">Teg saýlanmady</span>
                  )}
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-emerald-500 hover:text-emerald-800"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <select
                  onChange={(e) => {
                    addTag(e.target.value);
                    e.target.value = "";
                  }}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="">+ Teg goş...</option>
                  {availableTags.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Cases Upload / Download */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <FolderArrowDownIcon className="h-4 w-4 text-slate-400" /> Testler (ZIP)
                </label>
                <input
                  type="file"
                  name="test_cases"
                  accept=".zip"
                  onChange={(e) =>
                    setProblem({ ...problem, test_cases: e.target.files[0] })
                  }
                  className="mt-3 block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={handleTestCaseDownload}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 text-slate-500" />
                  Şu wagtky testleri ýükle
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Multilingual Content */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {/* Language Switcher Tabs */}
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                    activeTab === lang.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                  }`}
                >
                  <ReactCountryFlag
                    code={lang.country}
                    svg
                    style={{ width: "16px", height: "16px", borderRadius: "2px" }}
                  />
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Dynamic Localized Fields */}
            <div className="space-y-5">
              <Input
                text="Ady"
                title={problem[activeTab].name}
                setTitle={(value) => handleChange(activeTab, "name", value)}
              />

              <Textarea
                text="Mazmun (Description)"
                description={problem[activeTab].description}
                setDescription={(value) => handleChange(activeTab, "description", value)}
                activeTab={activeTab}
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Textarea
                  text="Input Formaty"
                  description={problem[activeTab].input}
                  setDescription={(value) => handleChange(activeTab, "input", value)}
                  activeTab={activeTab}
                />
                <Textarea
                  text="Output Formaty"
                  description={problem[activeTab].output}
                  setDescription={(value) => handleChange(activeTab, "output", value)}
                  activeTab={activeTab}
                />
              </div>

              <Textarea
                text="Bellik (Note)"
                description={problem[activeTab].note}
                setDescription={(value) => handleChange(activeTab, "note", value)}
                activeTab={activeTab}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to={`/admin/contest/${id}/problems`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none"
            >
              Goýbolsun
            </Link>
            <button
              type="button"
              disabled={saving}
              onClick={onSaveClick}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none disabled:opacity-50"
            >
              {saving ? "Ýüklenýär..." : "Täzele"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}