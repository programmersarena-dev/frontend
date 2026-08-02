import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useParams, Link } from "react-router-dom";

export default function ProfileMenu() {
  const { currentUser } = useStateContext();
  const { username } = useParams();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-5">
      <h2 className="text-xl font-semibold mb-4">{username}</h2>
      <nav className="flex space-x-6">
        <Link
          to={`/profile/${username}`}
          className="text-gray-700 hover:text-blue-500"
        >
          Profil
        </Link>
        {currentUser.name === username &&
          currentUser.email_verified_at && (
          <Link
            to={`/profile/${username}/edit`}
            className="text-gray-700 hover:text-blue-500"
          >
            Sazlamalar
          </Link>
        )}
        <Link
          to={`/profile/${username}/submissions`}
          className="text-gray-700 hover:text-blue-500"
        >
          Iberilen kodlar
        </Link>
        <Link
          to={`/profile/${username}/ratings`}
          className="text-gray-700 hover:text-blue-500"
        >
          Reýting üýtgemeler
        </Link>
      </nav>
    </div>
  );
}
