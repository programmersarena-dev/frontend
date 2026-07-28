import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ResetPassword() {
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEmail(queryParams.get("email") || "");
    setToken(queryParams.get("token") || "");
  }, [location.search]);

  const handleInputChange = (setter, fieldName) => (ev) => {
    setter(ev.target.value);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    axiosClient
      .post("/password/reset", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then((res) => {
        addToast("success", res.data.message || __("auth.password-reset-success") || "Password updated successfully!");
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
            password: serverErrors.password ? serverErrors.password[0] : "",
            password_confirmation: serverErrors.password_confirmation ? serverErrors.password_confirmation[0] : "",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">
        <div className="flex flex-col items-center justify-center">
          <img className="h-20 w-auto object-contain mb-4" src="/logo.png" alt="ProgrammersArena Logo" />
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            {__("auth.new-password-title") || "Choose a new password"}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {__("auth.back-to")}{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
            >
              {__("auth.login-text") || "Login here"}
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.new-password") || "New Password"}
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={handleInputChange(setPassword, "password")}
                className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.password
                    ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                  } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password-confirmation-input" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.confirm-new-password") || "Confirm New Password"}
              </label>
              <input
                id="password-confirmation-input"
                name="password_confirmation"
                type="password"
                required
                disabled={loading}
                value={passwordConfirmation}
                onChange={handleInputChange(setPasswordConfirmation, "password_confirmation")}
                className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.password_confirmation
                    ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                  } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder="••••••••"
              />
              {errors.password_confirmation && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:bg-indigo-700 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-sm"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? __("auth.loading") || "Loading..." : __("auth.update-password") || "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}