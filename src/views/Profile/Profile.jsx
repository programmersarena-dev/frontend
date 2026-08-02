import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { Link, useParams } from "react-router-dom";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import {
  CheckCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FormatToUTC from "@/components/core/FormatToUTC";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const { username } = useParams();
  const { addToast } = useToast();

  useEffect(() => {
    axiosClient
      .get(`/profile/${username}`)
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, []);

  const handleResend = () => {
    axiosClient
      .post("/email/resend")
      .then(() => {
        addToast("E-poçta salgyňyza üstünlikli iberildi");
      })
      .catch(() => {
        addToast("Ýalňyşlyk ýüze çykdy");
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!user.name) {
    return <NotFound />;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center text-white">
        {user.image ? (
          <img
            className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-white"
            src={user.image}
            alt={`${user.name}'s profile`}
          />
        ) : (
          <UserIcon className="h-32 w-32 rounded-full text-white mx-auto" />
        )}
        <h2 className="text-3xl font-bold mt-4">{user.name}</h2>
        <div className="flex justify-center items-center mt-2">
          {user.is_online === 1 ? (
            <div className="flex items-center text-green-300">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Onlaýn
            </div>
          ) : (
            <div className="flex items-center text-red-300">
              <XMarkIcon className="h-5 w-5 mr-1" />
              Oflaýn
            </div>
          )}
        </div>
      </div>
      <div className="p-6 bg-white">
        {currentUser.name === username &&
          currentUser.email_verified_at !== null ? (
          <div className="flex justify-end mb-4">
            <Link
              to={`/profile/${user.name}/edit`}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Profili üýtgetmek
            </Link>
          </div>
        ) : (
          currentUser.name === username && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                E-poçta salga tassyklama iber
              </button>
            </div>
          )
        )}
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Profil maglumatlar
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="text-gray-600">
            <span className="font-semibold">Ady: </span>
            {user.firstName}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Familiýasy: </span>
            {user.lastName}
          </div>
          {user.country && (
            <div className="text-gray-600">
              <span className="font-semibold">Ýurdy: </span>
              {user.country}
            </div>
          )}
          <div className="text-gray-600">
            <span className="font-semibold">Reýtingi: </span>
            {user.current_rating || "0"}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Işlän mesele sany: </span>
            {user.acceptedProblemsCount}
          </div>
        </div>
      </div>
    </div>
  );
}
