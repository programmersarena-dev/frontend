import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import Loading from "../components/core/Loading";
import { useStateContext } from "../contexts/ContextProvider";
import ProblemSidebar from "../components/Problemset/ProblemSidebar";
import NotFound from "../components/core/NotFound";
import PdfViewer from "../components/core/PdfViewer";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function Problem() {
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState({});
  const [file, setFile] = useState(null);
  const { showToast, t } = useStateContext();
  const { id, char } = useParams();

  const copyToClipboard = (clipboardData, showText) => {
    navigator.clipboard
      .writeText(clipboardData)
      .then(() => {
        showToast(showText);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  };

  useEffect(() => {
    axiosClient
      .get(`/problemset/problem/${id}/${char}`)
      .then((res) => {
        setProblem(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching problem:", error);
        setLoading(false);
      });

    const fetchPdf = async () => {
      const response = await fetch(problem.statement);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFile(url);
    };

    fetchPdf();
  }, []);

  if (loading) return <Loading />;

  if (!problem.name) return <NotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {!problem.statement && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                  {char}. {problem.name}
                </h1>
                <div className="text-sm text-gray-600">
                  <p>
                    {t("problem.time-limit-per-test")}:{" "}
                    <strong>{problem.time_limit} s</strong>
                  </p>
                  <p>
                    {t("problem.memory-limit-per-test")}:{" "}
                    <strong>{problem.memory_limit} MB</strong>
                  </p>
                </div>
              </div>
              <div className="mb-8">
                <div
                  className="text-gray-800 text-justify leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t("problem.input")}</h2>
                <div
                  className="bg-gray-100 p-4 rounded"
                  dangerouslySetInnerHTML={{ __html: problem.input }}
                ></div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t("problem.output")}</h2>
                <div
                  className="bg-gray-100 p-4 rounded"
                  dangerouslySetInnerHTML={{ __html: problem.output }}
                ></div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t("problem.test-cases")}</h2>
                <div>
                  {problem.example_test_cases && problem.example_test_cases.map((example_test_case, index) => (
                    <div key={index} className="bg-gray-100 border mb-4 p-2">
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{t("problem.input")}</h3>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() =>
                              copyToClipboard(
                                example_test_case.input,
                                t("problem.copied-input")
                              )
                            }
                          >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <pre className="bg-white p-4 rounded mt-2 text-gray-800">
                          {example_test_case &&
                            example_test_case.input &&
                            example_test_case.input
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                        </pre>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{t("problem.output")}</h3>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() =>
                              copyToClipboard(
                                example_test_case.output,
                                t("problem.copied-output")
                              )
                            }
                          >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <pre className="bg-white p-4 rounded mt-2 text-gray-800">
                          {example_test_case &&
                            example_test_case.output &&
                            example_test_case.output
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {!problem.example_test_cases && (
                    <p className="text-gray-600">{t("problem.test-not-found")}</p>
                  )}
                </div>
              </div>

              {problem.note && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">{t("problem.note")}</h2>
                  <p
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{ __html: problem.note }}
                  ></p>
                </div>
              )}
            </>
          )}
          {problem.statement && (
            <div>
              {file ? (
                <PdfViewer file={problem.statement} />
              ) : (
                <p>{t("problem.loading-pdf")}</p>
              )}
            </div>
          )}
        </div>

        <ProblemSidebar
          setLoading={setLoading}
          problem={problem}
          id={id}
          char={char}
          attachments={problem.statement ? true : false}
          languages={problem.acceptableLanguages}
          contest={problem.contest}
        />
      </div>
    </div>
  );
}
