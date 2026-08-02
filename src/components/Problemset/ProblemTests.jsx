import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export default function ProblemTests({ tests, subtasks }) {
  const { __ } = useTranslation();
  const [openSubtasks, setOpenSubtasks] = useState({});

  const toggleSubtask = (index) => {
    setOpenSubtasks((prevOpenSubtasks) => ({
      ...prevOpenSubtasks,
      [index]: !prevOpenSubtasks[index],
    }));
  };
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-2">{__("submission.tester")}</h3>
      {!subtasks && tests && tests.length > 0 &&
        tests.map((test, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{__("submission.test")} #{index + 1}</h3>
              <div className="flex space-x-4">
                <div>
                  <span className="font-semibold">{__("submission.test-time")}:</span> {test.time} ms
                </div>
                <div>
                  <span className="font-semibold">{__("submission.test-memory")}:</span> {test.memory} KB
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1">{__("submission.test-input")}</div>
              <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded-md">
                {test.input}
              </pre>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1">{__("submission.test-output")}</div>
              <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded-md">
                {test.output}
              </pre>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1">{__("submission.test-expected-output")}</div>
              <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded-md">
                {test.expected_output}
              </pre>
            </div>
            <div>
              <div className="font-semibold mb-1">{__("submission.test-log")}</div>
              <div
                className={`px-4 py-2 rounded-md ${test.log === "OK"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {test.log}
              </div>
            </div>
          </div>
        ))}
      {subtasks && tests && tests.length > 0 && tests.map((subtask, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div
            className="cursor-pointer flex justify-between items-center"
            onClick={() => toggleSubtask(index)}
          >
            <h3 className="text-lg font-semibold">
              {__("submission.subtask")} #{index}
            </h3>
            <div className="text-gray-500">
              {openSubtasks[index] ? '-' : '+'}
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-2">{subtask.point}</div>
          {openSubtasks[index] && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              {subtask.subTaskResults && subtask.subTaskResults.map((test, index_1) => (
                <div
                  key={index_1}
                  className="flex justify-between bg-gray-50 p-3 rounded-md mb-2"
                >
                  <div className="font-medium">Test #{index_1 + 1}</div>
                  <div className={`font-semibold ${test.log === "OK" ? "text-green-600" : test.log === "WA" ? "text-red-600" : "text-gray-700"}`}>{test.log}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
