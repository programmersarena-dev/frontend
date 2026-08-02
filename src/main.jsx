import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import router from "@/router";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <TranslationProvider>
          <RouterProvider router={router} />
        </TranslationProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
