import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import NotFound from "@/components/core/NotFound";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-colors";

const Field = ({ label, htmlFor, error, children }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium text-slate-500"
    >
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

export default function ProfileEditView() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const { handle } = useParams();
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser.handle !== handle || currentUser.email_verified_at == null) {
    return <NotFound />;
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    if (user.image) formData.append("image", user.image);
    if (user.old_password) formData.append("old_password", user.old_password);
    if (user.password) formData.append("password", user.password);
    if (user.password_confirmation)
      formData.append("password_confirmation", user.password_confirmation);
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    if (user.country_id) formData.append("country_id", user.country_id);

    axiosClient
      .post(`/profile/${handle}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        addToast("Siziň profiliňiz üstünlikli täzelendi");
        setUser((prevState) => ({
          ...prevState,
          image: data.image,
        }));
        navigate(`/profile/${handle}`);
      })
      .catch((err) => {
        const serverErrors = err.response.data.errors;
        setErrors({
          old_password: serverErrors.old_password
            ? serverErrors.old_password[0]
            : "",
          password: serverErrors.password ? serverErrors.password[0] : "",
          password_confirmation: serverErrors.password_confirmation
            ? serverErrors.password_confirmation[0]
            : "",
          first_name: serverErrors.first_name ? serverErrors.first_name[0] : "",
          last_name: serverErrors.last_name ? serverErrors.last_name[0] : "",
          image: serverErrors.image ? serverErrors.image[0] : "",
        });
      });
  };

  useEffect(() => {
    axiosClient
      .get(`/profile/${handle}/edit`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
    axiosClient.get("/countries").then((res) => {
      setCountries(res.data);
    });
  }, [handle]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="border border-slate-100 rounded-2xl p-6 space-y-5"
      >
        <div className="text-center pb-1">
          {user.current_image ? (
            <img
              src={user.current_image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <UserIcon className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>

        <Field label="Suraty üýtget" error={errors.image}>
          <input
            type="file"
            onChange={(e) => setUser({ ...user, image: e.target.files[0] })}
            className="mt-1.5 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-50 file:text-slate-600 hover:file:bg-slate-100"
          />
        </Field>

        <Field label="Köne parol" htmlFor="old_password" error={errors.old_password}>
          <input
            id="old_password"
            name="old_password"
            type="password"
            onChange={(e) => setUser({ ...user, old_password: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Täze parol" htmlFor="password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">
            Üýtgetmek islemeýän bolsaňyz, paroly boş goýuň
          </p>
        </Field>

        <Field
          label="Täze paroly tassykla"
          htmlFor="password_confirmation"
          error={errors.password_confirmation}
        >
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            onChange={(e) =>
              setUser({ ...user, password_confirmation: e.target.value })
            }
            className={inputClass}
          />
        </Field>

        <Field label="At" htmlFor="first_name" error={errors.first_name}>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={user.first_name || ""}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Familiýa" htmlFor="last_name" error={errors.last_name}>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={user.last_name || ""}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="Ýurt" htmlFor="country_id" error={errors.country_id}>
          <select
            id="country_id"
            name="country_id"
            value={user.country_id || ""}
            onChange={(e) => setUser({ ...user, country_id: e.target.value })}
            className={inputClass}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/profile/${handle}`)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Goýbolsun
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Täzele
          </button>
        </div>
      </form>
    </div>
  );
}