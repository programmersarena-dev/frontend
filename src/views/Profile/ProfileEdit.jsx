import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "../../components/core/Loading";
import { useStateContext } from "../../contexts/ContextProvider";
import NotFound from "../../components/core/NotFound";
import { UserIcon } from "@heroicons/react/24/outline";

export default function ProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const { username } = useParams();
  const { showToast, currentUser } = useStateContext();
  const navigate = useNavigate();

  if (currentUser.name !== username || currentUser.email_verified_at == null) {
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
      .post(`/profile/${username}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        showToast("Siziň profiliňiz üstünlikli täzelendi");
        setUser((prevState) => ({
          ...prevState,
          image: data.image, // Update the user state with the new image URL
        }));
        navigate(`/profile/${username}`);
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
      .get(`/profile/${username}/edit`)
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
  }, [username]);

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto mt-8 space-y-6">
      <div>
        <div className="mb-6">
          {user.current_image ? (
            <img
              src={user.current_image}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          ) : (
            <UserIcon className="w-24 h-24 rounded-full mx-auto text-gray-500" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Suraty üýtget
          </label>
          <input
            type="file"
            onChange={(e) => setUser({ ...user, image: e.target.files[0] })}
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.image && (
            <small className="text-red-500">{errors.image}</small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="old_password"
            className="block text-sm font-medium text-gray-700"
          >
            Köne parol
          </label>
          <input
            id="old_password"
            name="old_password"
            type="password"
            onChange={(e) =>
              setUser({ ...user, old_password: e.target.value })
            }
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.old_password && (
            <small className="text-red-500">{errors.old_password}</small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Täze parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <small className="text-gray-500">
            Üýtgetmek islemeýän bolsaňyz, paroly boş goýuň
          </small>
          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Täze paroly tassykla
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            onChange={(e) =>
              setUser({
                ...user,
                password_confirmation: e.target.value,
              })
            }
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password_confirmation && (
            <small className="text-red-500">
              {errors.password_confirmation}
            </small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            At
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={user.first_name || ""}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.first_name && (
            <small className="text-red-500">{errors.first_name}</small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Familiýa
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={user.last_name || ""}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.last_name && (
            <small className="text-red-500">{errors.last_name}</small>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="country_id"
            className="block text-sm font-medium text-gray-700"
          >
            Ýurt
          </label>
          <select
            id="country_id"
            name="country_id"
            value={user.country_id || ""}
            onChange={(e) => setUser({ ...user, country_id: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country_id && (
            <small className="text-red-500">{errors.country_id}</small>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(`/profile/${username}`)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Goýbolsun
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Täzele
        </button>
      </div>
    </form>
  );
}
