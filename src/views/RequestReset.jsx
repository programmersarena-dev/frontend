import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function RequestReset() {
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (ev) => {
    setEmail(ev.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors({});

    axiosClient
      .post("/password/email", { email })
      .then(({ data }) => {
        addToast("success", data.message || __("auth.reset-email-success") || "Recovery link sent!");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        const serverErrors = err.response?.data?.errors;
        const serverMessage = err.response?.data?.message;

        if (serverMessage) {
          addToast("error", serverMessage);
        }

        if (serverErrors) {
          setErrors({
            email: serverErrors.email ? serverErrors.email[0] : "",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-slate-950 p-8 rounded-3xl shadow-2xl border border-slate-800/60">
        <div className="flex flex-col items-center justify-center">
          <img className="h-20 w-auto object-contain mb-4" src="/logo.png" alt="ProgrammersArena Logo" />
          <h2 className="text-center text-3xl font-extrabold text-slate-100 tracking-tight">
            {__("auth.reset_password_title") || "Reset your password"}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {__("auth.reset_password_subtitle") || "Remember your credentials?"}{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus:underline"
            >
              {__("auth.login-text") || "Login here"}
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-slate-300 mb-1">
                {__("auth.email_label") || "Email Address"}
              </label>
              <input
                id="email-input"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={handleInputChange}
                className={`block w-full px-4 py-2.5 bg-slate-900 border ${errors.email ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  } placeholder-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder={__("auth.email_placeholder") || "Enter your email address"}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:bg-indigo-700 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? __("auth.loading") || "Loading..." : __("auth.send_reset_link") || "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="w-full flex justify-center py-2.5 px-4 border border-slate-700 text-sm font-semibold rounded-xl text-slate-300 bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-700/40 transition duration-200 text-center"
            >
              {__("auth.back") || "Back"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}