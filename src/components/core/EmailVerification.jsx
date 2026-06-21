import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import Loading from "./Loading";
import { useStateContext } from "../../contexts/ContextProvider";

export default function EmailVerification() {
  const { showToast } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const verificationUrl = query.get("url");

    if (!verificationUrl) {
      showToast("Nädogry ssylka.");
      return;
    }

    axiosClient
      .get(verificationUrl)
      .then((response) => {
        showToast("E-poçta üstünlikli tassyklanyldy!");
      })
      .catch((error) => {
        showToast("E-poçta barlag şowsuz. Gaýtadan synanyşmagyňyzy haýyş edýäris.");
      });
    return navigate("/");
  }, [location.search, navigate]);

  return <Loading />;
}
