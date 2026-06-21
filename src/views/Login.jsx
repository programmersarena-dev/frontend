import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import Loading from "../components/core/Loading.jsx";

export default function Login() {
  const { setCurrentUser, setUserToken, showToast, t } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setRememberMe(prev => !prev);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    axiosClient
      .post("/login", {
        email,
        password,
        remember: rememberMe,
      })
      .then(({ data }) => {
        showToast(data.message);
        setCurrentUser(data.user);
        setUserToken(data.token);
        if (data.user.user_type === "admin") return navigate("/admin");
        return navigate("/");
      })
      .catch((err) => {
        console.log(err);
        showToast(err.response.data.message);
        const serverErrors = err.response.data.errors;
        setErrors({
          email: serverErrors?.email ? serverErrors.email[0] : "",
          password: serverErrors?.password ? serverErrors.password[0] : "",
        });
      }).finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-center">
          <img className="h-24" src="/logo.png" alt="logo" />
        </div>
        <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("auth.login-text")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.not-registered")}{" "}
          <Link
            to="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.register-text")}
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              {t("auth.email")}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="E-poçta salgysy"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              {t("auth.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Parol"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2">{t("auth.remember-me")}</span>
          </label>

          <div className="text-sm">
            <Link
              to="/request-reset"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t("auth.forgot-password")}
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("auth.login")}
          </button>
          <Link
            to="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            {t("auth.back")}
          </Link>
        </div>
      </form>
    </div>
  );
}
