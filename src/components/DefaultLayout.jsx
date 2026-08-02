import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { Outlet, useLocation } from "react-router-dom";
import Loading from "@/components/core/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function DefaultLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchUserActivity = () => {
      if (currentUser) axiosClient.post("/auth/activity");
    };
    fetchUserActivity();
    const intervalId = setInterval(fetchUserActivity, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
