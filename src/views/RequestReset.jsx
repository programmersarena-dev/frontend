import { useState } from "react";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const { showToast } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post("/password/email", { email })
      .then(({ data }) => {
        showToast(data.message);
      })
      .catch((err) => {
        showToast(err.response.data.message);
      });
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="flex items-center justify-center">
        <img className="h-32" src="/logo.png" alt="logo" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="E-poçta salgysy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            E-poçta iber
          </button>
          <Link
            to="/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Yza dolan
          </Link>
        </div>
      </form>
    </div>
  );
}
