import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui";
import { Button, Input, Tabs, Tab } from "@/components/ui";
import Loading from "../../../components/core/Loading";
import ProblemTags from "../../../components/Problemset/ProblemTags";
import { useStateContext } from "../../../contexts/ContextProvider";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminComponent from "@/components/Admin/AdminComponent";
import ReactCountryFlag from "react-world-flags";

export default function EdiProblem() {
  const { showToast } = useStateContext();
  const { id, char } = useParams();
  const [activeTab, setActiveTab] = useState("tm");
  const [problem, setProblem] = useState({
    tags: [],
    time_limit: 1,
    memory_limit: 256,
    score: 0,
    test_cases: "",
    tm: { name: "", description: "", input: "", output: "", note: "" },
    en: { name: "", description: "", input: "", output: "", note: "" },
    ru: { name: "", description: "", input: "", output: "", note: "" },
  });
  const [loading, setLoading] = useState(true);
  const tags = JSON.parse(ProblemTags());
  const navigate = useNavigate();

  const handleChange = (lang, field, value) => {
    setProblem((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  useEffect(() => {
    axiosClient
      .get(`/admin/contest/${id}/problem/${char}`)
      .then(({ data }) => {
        setProblem({
          tags: data.tags,
          time_limit: data.time_limit,
          memory_limit: data.memory_limit,
          score: data.score,
          test_cases: data.test_cases,
          tm: { name: data.name, description: data.description, input: data.input, output: data.output, note: data.note },
          en: { name: data.name_en, description: data.description_en, input: data.input_en, output: data.output_en, note: data.note_en },
          ru: { name: data.name_ru, description: data.description_ru, input: data.input_ru, output: data.output_ru, note: data.note_ru },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading problem data:", err);
        setLoading(false);
      });
  }, [id, char]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblem((prevProblem) => ({
      ...prevProblem,
      [name]: value,
    }));
  };

  const handleEditorChange = (event, editor, field) => {
    const data = editor.getData();
    setProblem((prevProblem) => ({
      ...prevProblem,
      [field]: data,
    }));
  };

  const addTag = (tag) => {
    if (tag && !problem.tags.includes(tag)) {
      setProblem((prevProblem) => ({
        ...prevProblem,
        tags: [...prevProblem.tags, tag],
      }));
    }
  };

  const removeTag = (tag) => {
    setProblem((prevProblem) => ({
      ...prevProblem,
      tags: prevProblem.tags.filter((t) => t !== tag),
    }));
  };

  const onSaveClick = () => {
    const formData = new FormData();
    formData.append("tags", JSON.stringify(problem.tags));
    formData.append("time_limit", problem.time_limit);
    formData.append("memory_limit", problem.memory_limit);
    formData.append("score", problem.score);
    formData.append("name", problem.tm.name);
    formData.append("description", problem.tm.description);
    formData.append("input", problem.tm.input);
    formData.append("output", problem.tm.output);
    formData.append("note", problem.tm.note);

    formData.append("name_en", problem.en.name);
    formData.append("description_en", problem.en.description);
    formData.append("input_en", problem.en.input);
    formData.append("output_en", problem.en.output);
    formData.append("note_en", problem.en.note);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        showToast(res.data.message);
        navigate(`/admin/contest/${id}/problems`);
      })
      .catch((err) => {
        console.error("Error updating problem:", err);
      });
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
      })
      .catch((error) => {
        console.error("Error downloading test cases:", error);
        alert("Failed to download test cases.");
      });
  };

  if (loading) return <Loading />;

  return (
    <AdminComponent>
      <div className="p-8 min-h-screen">
        <div className="flex justify-between mb-6">
          <AdminPageHeader title="Meseläni üýtget" />
          <h3 className="text-2xl font-bold"></h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tegler:
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1"
                  onClick={() => removeTag(tag)}
                >
                  {tag} <XMarkIcon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <div className="mt-2">
              <select
                onChange={(e) => addTag(e.target.value)}
                className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Teg saýla</option>
                {tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teste berilýän wagt (s):
            </label>
            <input
              type="number"
              name="time_limit"
              value={problem.time_limit}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teste berilýän göwrüm (MB):
            </label>
            <input
              type="number"
              name="memory_limit"
              value={problem.memory_limit}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bal / Çylşyrymlylygy:
            </label>
            <input
              type="number"
              name="score"
              value={problem.score}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Testler (zip):
            </label>
            <input
              type="file"
              name="test_cases"
              onChange={(e) =>
                setProblem({ ...problem, test_cases: e.target.files[0] })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleTestCaseDownload}
              className="mt-2 ml-2 py-2 px-4 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Su wagtky testleri ýükle
            </button>
          </div>
          <div className="mb-4">
            <Tabs>
              <Tab active={activeTab === "tm"} onClick={() => setActiveTab("tm")}>
                <ReactCountryFlag code="TM" svg style={{ width: '24px', height: '24px' }} />
              </Tab>
              <Tab active={activeTab === "en"} onClick={() => setActiveTab("en")}>
                <ReactCountryFlag code="US" svg style={{ width: '24px', height: '24px' }} />
              </Tab>
              <Tab active={activeTab === "ru"} onClick={() => setActiveTab("ru")}>
                <ReactCountryFlag code="RU" svg style={{ width: '24px', height: '24px' }} />
              </Tab>
            </Tabs>
          </div>
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
            text="Input"
            description={problem[activeTab].input}
            setDescription={(value) => handleChange(activeTab, "input", value)}
            activeTab={activeTab}
          />
          <Textarea
            text="Output"
            description={problem[activeTab].output}
            setDescription={(value) => handleChange(activeTab, "output", value)}
            activeTab={activeTab}
          />
          <Textarea
            text="Note"
            description={problem[activeTab].note}
            setDescription={(value) => handleChange(activeTab, "note", value)}
            activeTab={activeTab}
          />
          <div className="flex justify-end mt-6 space-x-4">
            <Link
              to={`/admin/contest/${id}/problems`}
              className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Goýbolsun
            </Link>
            <button
              type="button"
              onClick={onSaveClick}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Täzele
            </button>
          </div>
        </div>
      </div>
    </AdminComponent>
  );
}
