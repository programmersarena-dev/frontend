import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormatToUTC from "../core/FormatToUTC";
import axiosClient from "@/api/axios";
import ContestDetails from "../Contest/ContestDetails";
import SubmissionVerdict from "../Submissions/SubmissionVerdict";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../contexts/TranslationContext";
import { useToast } from "../../contexts/ToastContext";

export default function ProblemSidebar({ setLoading, problem, id, char, attachments, languages, contest }) {
  const { currentUser } = useAuth();
  const { __ } = useTranslation();
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState(languages[0]);
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

    axiosClient
      .post(
        `/problemset/problem/${id}/${char}/submit`,
        { file, language },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        addToast("Üstünlikli iberildi");
        navigate("/problemset/status");
      })
      .catch((err) => {
        addToast(err.response.data.message);
        setLoading(false);
      });
  };

  const handleDownload = async () => {
    try {
      const response = await axiosClient.get(
        `/problemset/problem/${id}/${char}/attachments`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attachment.zip");
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <ContestDetails contest={contest} />

      {attachments && (
        <div className="border border-gray-300 rounded-xl py-4 px-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-300">
            {__("problem.attachments")}
          </h2>
          <p className="text-gray-800 underline">
            <button onClick={handleDownload}>{__("problem.download")}</button>
          </p>
        </div>
      )}

      <form
        className="w-full mx-auto bg-white border border-gray-200 rounded-xl py-6 px-8 shadow-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-300">
          {__("problem.send")}
        </h2>

        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="language"
          >
            {__("problem.lang")}:
          </label>
          <select
            id="language"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages && languages.map((lang, index) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="file"
          >
            {__("problem.select-file")}:
          </label>
          <input
            id="file"
            type="file"
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring focus:ring-blue-200"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition duration-300"
          >
            {__("problem.send")}
          </button>
        </div>
      </form>

      {problem.submissions && problem.submissions.length > 0 && (
        <div className="border border-gray-300 rounded-xl py-4 px-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-gray-300">
            {__("problem.last-submissions")}
          </h2>
          <div className="text-xs space-y-2">
            <div className="flex justify-between font-medium text-gray-600">
              <div className="w-1/5">#</div>
              <div className="w-2/5">{__("submission.nav-when")}</div>
              <div className="w-1/5">{__("submission.nav-lang")}</div>
              <div className="w-1/5">{__("submission.nav-verdict")}</div>
            </div>
            {problem.submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                <div className="w-1/5 text-blue-500 hover:underline">
                  <Link
                    to={`/contest/${id}/submission/${submission.id}`}
                    key={submission.id}
                  >
                    {submission.id}
                  </Link>
                </div>
                <div className="flex items-center w-2/5 text-gray-800">
                  <FormatToUTC dateTime={submission.created_at} />
                </div>
                <div className="w-1/5 text-gray-800">{submission.language}</div>
                <div className="w-1/5 text-sm">
                  <SubmissionVerdict verdict={submission.verdict} className="text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {problem.tags && problem.tags.length > 0 && (
        <div className="border border-gray-300 rounded-xl py-4 px-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-800">
            {__("problem.tags")}
          </h2>
          <div className="flex flex-wrap justify-center">
            {problem.tags.length > 0 &&
              problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full mr-2 mb-2"
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
