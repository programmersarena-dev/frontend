import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Login() {
  const { setUser } = useAuth();
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (setter, fieldName) => (ev) => {
    setter(ev.target.value);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors({});

    axiosClient
      .post("/auth/login", {
        login,
        password,
        remember: rememberMe,
      })
      .then(({ data }) => {
        addToast("success", data.message || __("auth.success-msg") || "Welcome back!");
        setUser(data.user);

        if (data.user?.user_type === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
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
            login: serverErrors.login ? serverErrors.login[0] : "",
            password: serverErrors.password ? serverErrors.password[0] : "",
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
            {__("auth.login-text") || "Login to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {__("auth.not-registered") || "Don't have an account?"}{" "}
            <Link
              to="/sign-up"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus:underline"
            >
              {__("auth.register-text") || "Register here"}
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">

            <div>
              <label htmlFor="login-input" className="block text-sm font-medium text-slate-300 mb-1">
                {__("auth.handle_or_email") || "Handle or Email"}
              </label>
              <input
                id="login-input"
                name="login"
                type="text"
                autoComplete="username"
                required
                disabled={loading}
                value={login}
                onChange={handleInputChange(setLogin, "login")}
                className={`block w-full px-4 py-2.5 bg-slate-900 border ${errors.login ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  } placeholder-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder={__("auth.handle_or_email_placeholder") || "Enter your handle or email"}
              />
              {errors.login && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.login}</p>
              )}
            </div>

            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-300 mb-1">
                {__("auth.password") || "Password"}
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                value={password}
                onChange={handleInputChange(setPassword, "password")}
                className={`block w-full px-4 py-2.5 bg-slate-900 border ${errors.password ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  } placeholder-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-300 select-none cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                disabled={loading}
                onChange={() => setRememberMe(prev => !prev)}
                className="h-4 w-4 bg-slate-900 text-indigo-600 border-slate-700 focus:ring-indigo-500/40 rounded transition duration-200"
              />
              <span className="ml-2 font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                {__("auth.remember-me") || "Remember me"}
              </span>
            </label>

            <Link
              to="/request-reset"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {__("auth.forgot-password") || "Forgot your password?"}
            </Link>
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
              {loading ? __("auth.loading") || "Loading..." : __("auth.login") || "Sign In"}
            </button>

            <Link
              to="/"
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