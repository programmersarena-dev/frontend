import { useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import Loading from "./core/Loading";
import ReactCountryFlag from "react-world-flags";

const availableLanguages = [
  { code: 'US', label: 'United Kingdom', title: 'en' },
  { code: 'RU', label: 'Russia', title: 'ru' },
  { code: 'TM', label: 'Turkmenistan', title: 'tm' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PageComponent() {
  const [loading, setLoading] = useState(false);
  const { currentUser, logout, lang, setLang, t } = useStateContext();

  const navigation = [
    { name: t("navigation.notifications"), to: "/blogs" },
    { name: t("navigation.contests"), to: "/contests" },
    { name: t("navigation.archive"), to: "/problemset" },
    { name: t("navigation.ratings"), to: "/ratings" },
  ];

  const changeLanguage = (language) => {
    setLoading(true);
    axiosClient
      .post(`/lang/${language}`)
      .then(() => {
        setLang(language);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8"
                      src="/logo.png"
                      alt="Programmers Arena"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={({ isActive }) => {
                            const active =
                              isActive ||
                              location.pathname.startsWith(item.to.substring(0, 5));
                            return classNames(
                              active
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            );
                          }}
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center">
                  <ul className="flex text-white">
                    {availableLanguages.map((language) => (
                      <li key={language.code} className="px-2">
                        <button
                          className={`language-btn ${lang === language.title ? 'active' : ''}`}
                          onClick={() => changeLanguage(language.title)}
                          disabled={loading}
                        >
                          <ReactCountryFlag code={language.code} svg style={{ width: '24px', height: '24px' }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {currentUser && (
                        <Menu as="div" className="ml-3">
                          <div className="flex  text-white">
                            <Link
                              to={`/profile/${currentUser.name}`}
                              className={"block px-4 py-2 text-sm border-r-2 "}
                            >
                              {currentUser.name}
                            </Link>

                            <button
                              onClick={(ev) => logout(ev)}
                              className={"block px-4 py-2 text-sm "}
                            >
                              {t("auth.logout")}
                            </button>
                          </div>
                        </Menu>
                      )}
                      {!currentUser && (
                        <Menu as="div" className="ml-3">
                          <div className="flex  text-white">
                            <Link
                              to="/sign-up"
                              className="block px-4 py-2 text-sm border-r-2"
                            >
                              {t("auth.sign-up")}
                            </Link>
                            <Link
                              to="/login"
                              className="block px-4 py-2 text-sm"
                            >
                              {t("auth.login")}
                            </Link>
                          </div>
                        </Menu>
                      )}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">{t("auth.open-main-menu")}</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) => {
                      const active =
                        isActive ||
                        location.pathname.includes(
                          item.to === "/" ? "blogs" : item.to.substring(0, 3)
                        );
                      return classNames(
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      );
                    }}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <ul className="flex items-center justify-center text-white p-2">
                {availableLanguages.map((language) => (
                  <li key={language.code} className="px-2">
                    <button
                      className={`language-btn ${lang === language.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(language.code)}
                      disabled={loading}
                    >
                      <ReactCountryFlag code={language.code} svg style={{ width: '24px', height: '24px' }} />
                    </button>
                  </li>
                ))}
              </ul>
              {currentUser && (
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        <Link
                          to={`/profile/${currentUser.name}`}
                        >
                          {currentUser.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button
                      as="a"
                      href="#"
                      onClick={(ev) => logout(ev)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("auth.logout")}
                    </Disclosure.Button>
                  </div>
                </div>
              )}
              {!currentUser && (
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="mt-3 space-y-1 px-2">
                    <NavLink
                      to="/sign-up"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("auth.sign-up")}
                    </NavLink>
                    <NavLink
                      to="/login"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("auth.login")}
                    </NavLink>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Outlet />

      <div className="text-center mt-8 pb-4 text-gray-500 text-sm">
        <hr className="border-gray-600" />
        <div className="py-5">
          <p>&copy; ProgrammersArena</p>
        </div>
      </div>
    </div>
  );
}
