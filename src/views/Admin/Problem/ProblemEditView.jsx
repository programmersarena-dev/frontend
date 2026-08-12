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

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-colors";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500">{label}</label>
    {children}
  </div>
);

export default function ProblemEditView() {
  const { addToast } = useToast();
  const { id, char } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tm");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [problem, setProblem] = useState({
    tags: [],
    time_limit: 1, // seconds, as shown in the UI
    memory_limit: 256,
    score: 500,
    difficulty: "",
    test_cases: null,
    tm: { name: "", description: "", input: "", output: "", note: "" },
    en: { name: "", description: "", input: "", output: "", note: "" },
    ru: { name: "", description: "", input: "", output: "", note: "" },
  });

  // Same call-a-component-as-a-function pattern flagged in ProblemCreateView,
  // but this file had NO try/catch around it at all — if ProblemTags()
  // really returns a React element rather than a JSON string, JSON.parse()
  // on a non-string coerces to "[object Object]" and throws, which would
  // crash this entire page on every render. Wrapped defensively; the real
  // fix still needs ProblemTags' source.
  const availableTags = React.useMemo(() => {
    try {
      const parsed = JSON.parse(ProblemTags() || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    axiosClient
      .get(`/admin/contest/${id}/problem/${char}`)
      .then(({ data }) => {
        setProblem({
          tags: data.tags || [],
          // time_limit comes back from the API in milliseconds (the raw
          // column value) — convert to seconds for display here, and back
          // to ms on submit below.
          time_limit: data.time_limit != null ? data.time_limit / 1000 : 1,
          memory_limit: data.memory_limit ?? 256,
          score: data.score ?? 500,
          difficulty: data.difficulty ?? "",
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
    // Seconds (UI) -> milliseconds (API/DB column), matching ProblemCreateView.
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
    <div className="max-w-4xl">
      <AdminPageHeader title={`Meseläni üýtget (${char})`} />

      <div className="mt-6 space-y-6">
        {/* Card 1: Parameters & Limits */}
        <div className="border border-slate-100 rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Parametrler we çäklendirmeler
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <Field label="Wagt çägi (sekunt)">
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

            <Field label="Ýat çägi (MB)">
              <input
                type="number"
                name="memory_limit"
                min="0"
                value={problem.memory_limit}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="Bal">
              <input
                type="number"
                name="score"
                min="500"
                value={problem.score}
                onChange={handleInputChange}
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="Çylşyrymlylyk">
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

        {/* Card 2: Tags & Test Cases */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <TagIcon className="h-3.5 w-3.5 text-slate-400" /> Tegler
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5 min-h-[38px] rounded-lg border border-slate-200 p-2">
                {problem.tags.length === 0 && (
                  <span className="text-xs text-slate-300 self-center px-1">Teg saýlanmady</span>
                )}
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <select
              onChange={(e) => {
                addTag(e.target.value);
                e.target.value = "";
              }}
              className={inputClass}
            >
              <option value="">+ Teg goş...</option>
              {availableTags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Test Cases Upload / Download */}
          <div className="border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <FolderArrowDownIcon className="h-3.5 w-3.5 text-slate-400" /> Testler (ZIP)
              </label>
              <input
                type="file"
                name="test_cases"
                accept=".zip"
                onChange={(e) =>
                  setProblem({ ...problem, test_cases: e.target.files[0] })
                }
                className="mt-2 block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-600 hover:file:bg-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={handleTestCaseDownload}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 text-slate-400" />
              Şu wagtky testleri ýükle
            </button>
          </div>
        </div>

        {/* Card 3: Multilingual Content */}
        <div className="border border-slate-100 rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveTab(lang.code)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === lang.code
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <ReactCountryFlag
                  code={lang.country}
                  svg
                  style={{ width: "14px", height: "14px", borderRadius: "2px" }}
                />
                {lang.label}
              </button>
            ))}
          </div>

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
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/admin/contest/${id}/problems`}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Goýbolsun
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={onSaveClick}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {saving ? "Ýüklenýär..." : "Täzele"}
          </button>
        </div>
      </div>
    </div>
  );
}