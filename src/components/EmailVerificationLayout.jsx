import { Outlet, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useEffect, useState } from "react";
import Loading from "./core/Loading";
import { useStateContext } from "../contexts/ContextProvider";

export default function EmailVerificationLayout() {
  const { setCurrentUser } = useStateContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/auth/me").then(({ data }) => {
      setLoading(false);
      setCurrentUser(data);
      if (!current) {
        return navigate("/login");
      }
      if (data.email_verified_at) {
        return navigate("/");
      }
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex items-center justify-center">
          <img className="h-32" src="/logo.png" alt="logo" />
        </div>

        <Outlet />

      </div>
    </div>
  );
}
