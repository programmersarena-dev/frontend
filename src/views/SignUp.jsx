import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import Loading from "../components/core/Loading.jsx";

export default function SignUp() {
  const { setCurrentUser, setUserToken, showToast, t } = useStateContext();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryId, setCountryId] = useState(181);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    axiosClient
      .post("/sign-up", {
        name: username,
        email,
        password,
        password_confirmation: passwordConfirmation,
        first_name: firstName,
        last_name: lastName,
        country_id: countryId,
      })
      .then(({ data }) => {
        setLoading(false);
        showToast(data.message);
        setCurrentUser(data.user);
        setUserToken(data.token);
        return navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        const serverErrors = err.response.data.errors;
        setErrors({
          name: serverErrors.name ? serverErrors.name[0] : "",
          email: serverErrors.email ? serverErrors.email[0] : "",
          password: serverErrors.password ? serverErrors.password[0] : "",
          first_name: serverErrors.first_name ? serverErrors.first_name[0] : "",
          last_name: serverErrors.last_name ? serverErrors.last_name[0] : "",
        });
      });
  };

  useEffect(() => {
    axiosClient.get("/countries").then((res) => {
      setCountries(res.data);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-center">
          <img className="h-24" src="/logo.png" alt="logo" />
        </div>
        <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("auth.register-text")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.or")}{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.login-text")}
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              {t("auth.username")}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(ev) => setUserName(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Ulanyjy ady"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              {t("auth.email")}
            </label>
            <input
              id="email"
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
          <div>
            <label htmlFor="password-confirmation" className="sr-only">
              {t("auth.confirm-password")}
            </label>
            <input
              id="password-confirmation"
              name="password_confirmation"
              type="password"
              required
              value={passwordConfirmation}
              onChange={(ev) => setPasswordConfirmation(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Paroly tassyklamak"
            />
            {errors.password_confirmation && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password_confirmation}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="first-name" className="sr-only">
              {t("auth.first-name")}
            </label>
            <input
              id="first-name"
              name="first_name"
              type="text"
              required
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.first_name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Ady"
            />
            {errors.first_name && (
              <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="last-name" className="sr-only">
              {t("auth.last-name")}
            </label>
            <input
              id="last-name"
              name="last_name"
              type="text"
              required
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.last_name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Familiýasy"
            />
            {errors.last_name && (
              <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
            {t("auth.country")}
          </label>
          <div className="mt-2">
            <select
              id="country"
              name="country"
              value={countryId}
              onChange={(ev) => setCountryId(parseInt(ev.target.value, 10))}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("auth.sign-up")}
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
