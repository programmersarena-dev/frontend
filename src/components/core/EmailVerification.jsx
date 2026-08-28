import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "./Loading";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function EmailVerification() {
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const verificationUrl = query.get("url");

    if (!verificationUrl) {
      addToast(__("core.email.invalid_link"));
      return;
    }

    axiosClient
      .get(verificationUrl)
      .then((response) => {
        addToast(__("core.email.verified"));
      })
      .catch((error) => {
        addToast(__("core.email.failed"));
      });
    return navigate("/");
  }, [location.search, navigate]);

  return <Loading />;
}
