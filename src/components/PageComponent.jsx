import { useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import ReactCountryFlag from "react-world-flags";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

const availableLanguages = [
  { code: 'US', label: 'United States', title: 'en' },
  { code: 'RU', label: 'Russia', title: 'ru' },
  { code: 'TM', label: 'Turkmenistan', title: 'tk' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PageComponent() {
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
    <div className="min-h-full bg-slate-50 text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-700 antialiased">
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link to="/" className="flex-shrink-0 transition transform hover:scale-105">
                    <img
                      className="h-8 w-auto"
                      src="/logo.png"
                      alt="Programmers Arena"
                    />
                  </Link>
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-1">
                      {navigation.map((item) => {
                        const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
                        return (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={classNames(
                              active
                                ? "text-emerald-600 bg-emerald-50/60 font-semibold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium",
                              "rounded-lg px-4 py-2 text-sm transition-all duration-200 relative group"
                            )}
                          >
                            <span>{item.name}</span>
                            {active && (
                              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  {/* Language Selector */}
                  <ul className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {availableLanguages.map((language) => (
                      <li key={language.code}>
                        <button
                          className={classNames(
                            "inline-flex items-center justify-center rounded-lg px-2.5 py-1 transition-all duration-200",
                            currentLang === language.title
                              ? "bg-white text-emerald-600 border border-slate-200 shadow-sm"
                              : "text-slate-400 hover:text-slate-700 border border-transparent"
                          )}
                          onClick={() => changeLanguage(language.title)}
                          disabled={loading}
                          title={language.label}
                        >
                          <ReactCountryFlag code={language.code} style={{ width: '18px', height: '18px', borderRadius: '2px', objectFit: 'cover' }} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Desktop User Panel */}
                  <div className="flex items-center">
                    {currentUser ? (
                      <Menu as="div" className="relative ml-3">
                        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
                          <Link
                            to={`/profile/${currentUser.handle || currentUser.name}`}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:text-emerald-600 font-medium transition rounded-lg hover:bg-white"
                          >
                            <div className="w-5 h-5 bg-emerald-100 rounded-md border border-emerald-200 flex items-center justify-center">
                              <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span>{currentUser.handle || currentUser.name}</span>
                          </Link>

                          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                          <button
                            onClick={(ev) => logout(ev)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title={__("auth.logout")}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </Menu>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                        <Link
                          to="/login"
                          className="px-4 py-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium transition"
                        >
                          {__("auth.login")}
                        </Link>
                        <Link
                          to="/sign-up"
                          className="px-4 py-1.5 text-sm bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-sm transition duration-200"
                        >
                          {__("auth.sign-up")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Trigger */}
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 focus:outline-none transition">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">{__("auth.open-main-menu")}</span>
                    {open ? (
                      <XMarkIcon className="block h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-5 w-5" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile View Panel */}
            <Disclosure.Panel className="md:hidden bg-white border-b border-slate-200 shadow-lg">
              <div className="space-y-1 px-3 pb-4 pt-2">
                {navigation.map((item) => {
                  const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          active || isActive
                            ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          "block px-4 py-2.5 text-base font-medium transition"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>

              {/* Language Selector Mobile */}
              <div className="px-4 pb-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 justify-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  {availableLanguages.map((language) => (
                    <button
                      key={language.code}
                      className={classNames(
                        "flex-1 inline-flex items-center justify-center rounded-lg py-2 transition-all duration-150",
                        currentLang === language.title
                          ? "bg-white text-emerald-600 border border-slate-200 shadow-sm"
                          : "text-slate-400 hover:text-slate-700"
                      )}
                      onClick={() => changeLanguage(language.title)}
                      disabled={loading}
                    >
                      <ReactCountryFlag code={language.code} style={{ width: '20px', height: '14px', borderRadius: '1px' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Authentication Mobile */}
              <div className="border-t border-slate-100 pb-4 pt-4 bg-slate-50/50">
                {currentUser ? (
                  <div>
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <Link 
                          to={`/profile/${currentUser.handle || currentUser.name}`}
                          className="text-base font-medium text-slate-800 hover:text-emerald-600 block transition"
                        >
                          {currentUser.handle || currentUser.name}
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-3">
                      <Disclosure.Button
                        as="button"
                        onClick={(ev) => logout(ev)}
                        className="w-full text-left block rounded-xl px-4 py-2.5 text-base font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        {__("auth.logout")}
                      </Disclosure.Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <NavLink
                      to="/login"
                      className="block text-center rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                    >
                      {__("auth.login")}
                    </NavLink>
                    <NavLink
                      to="/sign-up"
                      className="block text-center bg-slate-900 text-white rounded-xl px-4 py-2.5 text-base font-semibold hover:bg-slate-800 transition shadow-sm"
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 selection:bg-emerald-500/20">
        <Outlet />
      </main>

      <footer className="text-center mt-16 pb-8 text-slate-500 text-xs max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-slate-200 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>&copy; {new Date().getFullYear()} ProgrammersArena. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition">Terms</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 cursor-pointer transition">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}