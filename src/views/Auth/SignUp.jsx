import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient, { setStoredToken } from "@/api/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "@/contexts/TranslationContext";

export default function SignUp() {
  const { setCurrentUser } = useAuth();
  const { addToast } = useToast();
  const { __ } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    handle: "",
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    country_id: 181,
  });

  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "country_id" ? parseInt(value, 10) || "" : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors({});

    axiosClient
      .post("/auth/signup", formData)
      .then(({ data }) => {
        setLoading(false);
        addToast(data.message || __("auth.success-register"), "success");

        setCurrentUser(data.user);
        if (data.token) {
          setStoredToken(data.token);
        }
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          const serverErrors = err.response.data.errors || {};
          const mappedErrors = {};
          Object.keys(serverErrors).forEach((key) => {
            mappedErrors[key] = serverErrors[key][0];
          });
          setErrors(mappedErrors);
        } else {
          addToast(__("auth.error-generic") || "An unexpected error occurred.", "error");
        }
      });
  };

  useEffect(() => {
    let isMounted = true;
    axiosClient
      .get("/countries")
      .then((res) => {
        if (isMounted) setCountries(res.data || []);
      })
      .catch(() => {
        if (isMounted) addToast("Failed to load countries list", "error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">

        <div className="flex flex-col items-center justify-center">
          <img className="h-20 w-auto object-contain mb-4" src="/logo.svg" alt="ProgrammersArena Logo" />
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            {__("auth.register-text")}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {__("auth.or")}{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
            >
              {__("auth.login-text")}
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">

            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.handle")}
              </label>
              <input
                id="handle"
                name="handle"
                type="text"
                required
                disabled={loading}
                value={formData.handle}
                onChange={handleChange}
                className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.handle
                    ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                  } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder="e.g., prog_tkm"
              />
              {errors.handle && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.handle}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.email
                    ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                  } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                placeholder="developer@programmersarena.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1">
                  {__("auth.first-name")}
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.first_name
                      ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                    } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                  placeholder="Oguz"
                />
                {errors.first_name && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1">
                  {__("auth.last-name")}
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2.5 bg-slate-50 border ${errors.last_name
                      ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600"
                    } placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-4 text-sm transition duration-200 disabled:opacity-50`}
                  placeholder="Hanow"
                />
                {errors.last_name && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country_id" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.country")}
              </label>
              <select
                id="country_id"
                name="country_id"
                disabled={loading}
                value={formData.country_id}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 rounded-xl focus:outline-none text-sm transition duration-200 disabled:opacity-50"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id} className="bg-white text-slate-900">
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country_id && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.country_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={loading}
                value={formData.password}
                onChange={handleChange}
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
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-1">
                {__("auth.confirm-password")}
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                disabled={loading}
                value={formData.password_confirmation}
                onChange={handleChange}
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

          <div className="pt-2 space-y-3">
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
              {loading ? __("auth.processing") || "Processing..." : __("auth.sign-up")}
            </button>

            <Link
              to="/"
              className="w-full flex justify-center py-2.5 px-4 border border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200 transition duration-200 text-center shadow-sm"
            >
              {__("auth.back")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}