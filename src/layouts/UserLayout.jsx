import { useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import {
  Bars3Icon,
  UserIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import ReactCountryFlag from "react-world-flags";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

const availableLanguages = [
  { code: "US", label: "United States", title: "en" },
  { code: "RU", label: "Russia", title: "ru" },
  { code: "TM", label: "Turkmenistan", title: "tk" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PageLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser, currentLang, setCurrentLang } = useAuth();
  const { __ } = useTranslation();

  const navigation = [
    { name: __("navigation.notifications"), to: "/blogs" },
    { name: __("navigation.contests"), to: "/contests" },
    { name: __("navigation.archive"), to: "/problemset" },
    { name: __("navigation.ratings"), to: "/ratings" },
  ];

  const isAdmin = currentUser?.user_type === "admin";

  const changeLanguage = (language) => {
    setLoading(true);
    axiosClient
      .post(`/locale/`, { lang: language })
      .then(() => {
        setCurrentLang(language);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Language switch error:", error);
        setLoading(false);
      });
  };

  const logout = (ev) => {
    ev.preventDefault();
    setLoading(true);
    axiosClient
      .post("/auth/logout")
      .then(() => {
        setCurrentUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased selection:bg-indigo-500/10 selection:text-indigo-600">
      <Disclosure
        as="nav"
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <Link
                    to="/"
                    className="flex-shrink-0 transition-opacity hover:opacity-85"
                  >
                    <img
                      className="h-8 w-auto"
                      src="/logo.svg"
                      alt="Programmers Arena"
                    />
                  </Link>

                  <div className="hidden md:block">
                    <div className="flex items-center space-x-1">
                      {navigation.map((item) => {
                        const active =
                          location.pathname === item.to ||
                          location.pathname.startsWith(item.to + "/");
                        return (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={classNames(
                              active
                                ? "bg-slate-100 text-slate-900 font-semibold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium",
                              "rounded-lg px-3.5 py-2 text-sm transition-colors duration-150"
                            )}
                          >
                            {item.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/80 p-1">
                    {availableLanguages.map((language) => (
                      <button
                        key={language.code}
                        className={classNames(
                          "flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-all duration-150",
                          currentLang === language.title
                            ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                            : "text-slate-500 hover:text-slate-900"
                        )}
                        onClick={() => changeLanguage(language.title)}
                        disabled={loading}
                        title={language.label}
                      >
                        <ReactCountryFlag
                          code={language.code}
                          style={{
                            width: "16px",
                            height: "12px",
                            borderRadius: "2px",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5" />
                      Admin
                    </Link>
                  )}

                  <div className="flex items-center border-l border-slate-200 pl-4">
                    {currentUser ? (
                      <Menu as="div" className="relative">
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 p-1">
                          <Link
                            to={`/profile/${currentUser.handle || currentUser.name}`}
                            className="flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 transition-colors"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-200/80 text-slate-600">
                              <UserIcon className="h-3.5 w-3.5" />
                            </div>
                            <span>{currentUser.handle || currentUser.name}</span>
                          </Link>

                          <div className="h-4 w-[1px] bg-slate-200" />

                          <button
                            onClick={(ev) => logout(ev)}
                            className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title={__("auth.logout")}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </Menu>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link
                          to="/login"
                          className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {__("auth.login")}
                        </Link>
                        <Link
                          to="/sign-up"
                          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors"
                        >
                          {__("auth.sign-up")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors">
                    <span className="sr-only">{__("auth.open-main-menu")}</span>
                    {open ? (
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="border-b border-slate-200 bg-white md:hidden">
              <div className="space-y-1 px-4 pt-2 pb-3">
                {navigation.map((item) => {
                  const active =
                    location.pathname === item.to ||
                    location.pathname.startsWith(item.to + "/");
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          active || isActive
                            ? "bg-slate-100 text-slate-900 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium",
                          "block rounded-lg px-3 py-2 text-base transition-colors"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  );
                })}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <ShieldCheckIcon className="h-4 w-4" />
                    Admin
                  </NavLink>
                )}
              </div>

              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 p-1">
                  {availableLanguages.map((language) => (
                    <button
                      key={language.code}
                      className={classNames(
                        "flex flex-1 items-center justify-center rounded-md py-1.5 transition-all",
                        currentLang === language.title
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                      onClick={() => changeLanguage(language.title)}
                      disabled={loading}
                    >
                      <ReactCountryFlag
                        code={language.code}
                        style={{
                          width: "18px",
                          height: "13px",
                          borderRadius: "2px",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <Link
                        to={`/profile/${currentUser.handle || currentUser.name}`}
                        className="text-base font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {currentUser.handle || currentUser.name}
                      </Link>
                    </div>
                    <Disclosure.Button
                      as="button"
                      onClick={(ev) => logout(ev)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-xs"
                    >
                      {__("auth.logout")}
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <NavLink
                      to="/login"
                      className="block rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                    >
                      {__("auth.login")}
                    </NavLink>
                    <NavLink
                      to="/sign-up"
                      className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-xs"
                    >
                      {__("auth.sign-up")}
                    </NavLink>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200/80 pt-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ProgrammersArena. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">
              Terms
            </span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">
              Privacy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}