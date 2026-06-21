import { Disclosure } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const navigation = [
  { name: "Baş sahypa", to: "/admin" },
  { name: "Suratlar", to: "/admin/images" },
  { name: "Bildirişler", to: "/admin/blogs" },
  { name: "Bäsleşikler", to: "/admin/contests" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout() {
  const { currentUser, logout } = useStateContext();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-gray-800 w-64 flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img
              className="h-8 w-8 mr-2"
              src="/logo.png"
              alt="ProgrammersArena"
            />
            <span className="text-white text-xl font-semibold">Admin</span>
          </div>
        </div>
        <div className="py-2 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={classNames(
                location.pathname.includes(item.to === '/admin' ? 'dashboard' : item.to.substring(0, 10))
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block py-2 px-4 text-sm rounded-md"
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        <div className="border-t border-gray-700 py-4 px-4">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            <span className="ml-2 text-sm font-medium text-white">
              {currentUser.name}
            </span>
          </div>
          <div className="mt-2">
            <button
              onClick={logout}
              className="block w-full py-2 px-4 text-sm text-left text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Çykmak
            </button>
          </div>
        </div>
      </Disclosure>

      <div className="flex-1 overflow-auto">
        <main className="p-4">
          <Outlet />
        </main>

        <footer className="bg-gray-100 px-4 py-2 mt-auto">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; ProgrammersArena</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
