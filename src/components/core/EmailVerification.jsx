import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "./Loading";
import { useToast } from "@/contexts/ToastContext";

export default function EmailVerification() {
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const verificationUrl = query.get("url");

    if (!verificationUrl) {
      addToast("Nädogry ssylka.");
      return;
    }

    axiosClient
      .get(verificationUrl)
      .then((response) => {
        addToast("E-poçta üstünlikli tassyklanyldy!");
      })
      .catch((error) => {
        addToast("E-poçta barlag şowsuz. Gaýtadan synanyşmagyňyzy haýyş edýäris.");
      });
    return navigate("/");
  }, [location.search, navigate]);

  return <Loading />;
}
