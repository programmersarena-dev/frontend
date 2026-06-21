import { UserIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

export default function ProblemItem({ index, problem, contestId }) {
  const char = String.fromCharCode("A".charCodeAt(0) + index);
  const location = useLocation();

  return (
    <tr
      className={`text-center transition-all duration-300 ${problem.accepted
        ? 'bg-green-50 border-l-4 border-green-500 shadow-md'
          : 'hover:bg-gray-100 hover:shadow-sm'
        }`}
    >
      <td className="py-4 px-6 border-b border-gray-200 font-semibold text-lg text-gray-800">
        {char}
      </td>
      <td className="py-4 px-6 border-b border-gray-200">
        <Link
          to={{
            pathname: `${location.pathname}/problem/${char}`,
            state: { problemId: problem.id },
          }}
          className={`flex items-center space-x-2 transition-colors duration-200 ${problem.accepted ? 'text-green-600' : 'text-blue-600 hover:underline'
            }`}
        >
          {
            problem.accepted === true ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5" />
            )
          }
          <span className="font-medium text-md">{problem.name}</span>
        </Link>
      </td>
      <td className="py-4 px-6 border-b border-gray-200">
        <Link
          to={`/contest/${contestId}/problem/${char}/submissions`}
          className="flex items-center justify-center space-x-2 transition-all duration-200 hover:text-gray-800"
        >
          <UserIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {problem.accepted_submissions_count}
          </span>
        </Link>
      </td>
    </tr>
  );
}
