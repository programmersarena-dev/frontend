import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ContestSubmitView() {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [acceptableLanguages, setAcceptableLanguages] = useState([]);
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState("");
  const [problemChar, setProblemChar] = useState("A");
  const { id } = useParams();
  const navigate = useNavigate();

  const getCharOfProblem = (index) => {
    return String.fromCharCode("A".charCodeAt(0) + index);
  }

  useEffect(() => {
    axiosClient
      .get(`/contest/${id}/problems`)
      .then((res) => {
        setProblems(res.data.problems);
        setAcceptableLanguages(res.data.acceptableLanguages);
        setLanguage(res.data.acceptableLanguages[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosClient
      .post(
        `/problemset/problem/${id}/${problemChar}/submit`,
        { file, language, code },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        addToast("Üstünlikli iberildi");
        navigate("/problemset/status");
      })
      .catch((err) => {
        setLoading(false);
        addToast(err.response.data.message);
        console.error("Failed to fetch submissions:", err);
        setLoading(false);
      });
  }

  if (!currentUser || !currentUser.name) return navigate('/login');
  if (!currentUser.email_verified_at) return navigate('/resend-verification-email');

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">{__("contest.submit")}</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
            {__("contest.problem")}:
          </label>
          <select
            name="problem"
            id="problem"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setProblemChar(e.target.value)}
          >
            {problems.map((problem, index) => (
              <option
                value={getCharOfProblem(index)}
                key={index}
              >
                {getCharOfProblem(index)} - {problem.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            {__("contest.language")}:
          </label>
          <select
            name="language"
            id="language"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {acceptableLanguages && acceptableLanguages.length > 0 && acceptableLanguages.map((acceptableLanguage, index) => (
              <option key={index} value={acceptableLanguage}>{acceptableLanguage}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            {__("contest.code")}:
          </label>
          <textarea
            name="code"
            id="code"
            rows="6"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            {__("contest.or-choose-file")}:
          </label>
          <input
            type="file"
            name="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 transition duration-200"
        >
          {__("contest.send")}
        </button>
      </form>
    </div>
  );
}
