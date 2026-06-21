import CountdownTimer from "../core/CountdownTimer";
import { Link, useParams } from "react-router-dom";

export default function ContestDetails({ contest }) {
  const { id } = useParams();

  return (
    <div className="border border-gray-300 rounded-xl py-4 px-6 shadow-lg">
      <p className="text-xl font-bold mb-4 border-b pb-2 border-gray-300 text-gray-800 underline">
        <Link
          to={`/contest/${id}`}
        >
          {contest.name}
        </Link>
      </p>
      <CountdownTimer
        dateString={contest.end_date}
        className="text-gray-400"
      />
    </div>
  );
}
