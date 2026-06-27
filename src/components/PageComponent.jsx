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
  const { user, setUser, currentLang, setCurrentLang } = useAuth();
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
        setUser(null);
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
    <div className="min-h-full bg-slate-900 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-400 antialiased">
      <Disclosure as="nav" className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800/80 header-glow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link to="/" className="flex-shrink-0 transition transform hover:scale-105">
                    <img
                      className="h-8 w-auto brightness-110 contrast-125"
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
                                ? "text-emerald-400 bg-zinc-900/60"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30",
                              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 relative group"
                            )}
                          >
                            <span>{item.name}</span>
                            {active && (
                              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  {/* Language Selector */}
                  <ul className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                    {availableLanguages.map((language) => (
                      <li key={language.code}>
                        <button
                          className={classNames(
                            "inline-flex items-center justify-center rounded-lg px-2.5 py-1 transition-all duration-200",
                            currentLang === language.title
                              ? "bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-sm"
                              : "text-zinc-500 hover:text-zinc-300 border border-transparent"
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
                    {user ? (
                      <Menu as="div" className="relative ml-3">
                        <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1">
                          <Link
                            to={`/profile/${user.handle || user.name}`}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-emerald-400 font-medium transition rounded-lg hover:bg-zinc-800/40"
                          >
                            <div className="w-5 h-5 bg-emerald-500/10 rounded-md border border-emerald-500/20 flex items-center justify-center">
                              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span>{user.handle || user.name}</span>
                          </Link>

                          <div className="w-[1px] h-5 bg-zinc-800 mx-1" />

                          <button
                            onClick={(ev) => logout(ev)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                            title={__("auth.logout")}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </Menu>
                    ) : (
                      <div className="flex items-center gap-2 bg-zinc-900/40 p-1 rounded-xl border border-zinc-800/60">
                        <Link
                          to="/login"
                          className="px-4 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 font-medium transition"
                        >
                          {__("auth.login")}
                        </Link>
                        <Link
                          to="/sign-up"
                          className="px-4 py-1.5 text-sm bg-zinc-100 text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 shadow-lg shadow-white/5 transition duration-200"
                        >
                          {__("auth.sign-up")}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Trigger */}
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-xl bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800 focus:outline-none transition">
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
            <Disclosure.Panel className="md:hidden bg-slate-900 border-b border-zinc-800 dynamic-shadow-sm">
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
                            ? "bg-zinc-900 text-emerald-400 border-l-2 border-emerald-500"
                            : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
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
              <div className="px-4 pb-4 pt-3 border-t border-zinc-900">
                <div className="flex items-center gap-2 justify-center bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800/80">
                  {availableLanguages.map((language) => (
                    <button
                      key={language.code}
                      className={classNames(
                        "flex-1 inline-flex items-center justify-center rounded-lg py-2 transition-all duration-150",
                        currentLang === language.title
                          ? "bg-zinc-800 text-emerald-400 border border-zinc-700/50"
                          : "text-zinc-500 hover:text-zinc-300"
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
              <div className="border-t border-zinc-900 pb-4 pt-4 bg-zinc-900/20">
                {user ? (
                  <div>
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <Link 
                          to={`/profile/${user.handle || user.name}`}
                          className="text-base font-medium text-zinc-200 hover:text-emerald-400 block transition"
                        >
                          {user.handle || user.name}
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-3">
                      <Disclosure.Button
                        as="button"
                        onClick={(ev) => logout(ev)}
                        className="w-full text-left block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-400 hover:bg-rose-950/20 hover:text-rose-400 transition"
                      >
                        {__("auth.logout")}
                      </Disclosure.Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <NavLink
                      to="/login"
                      className="block text-center rounded-xl px-4 py-2.5 text-base font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-zinc-800 transition"
                    >
                      {__("auth.login")}
                    </NavLink>
                    <NavLink
                      to="/sign-up"
                      className="block text-center bg-zinc-100 text-zinc-900 rounded-xl px-4 py-2.5 text-base font-semibold hover:bg-zinc-200 transition"
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

      <main className="mx-auto max-w-100 px-4 sm:px-6 lg:px-8 py-8 selection:bg-emerald-500/20">
        <Outlet />
      </main>

      <footer className="text-center mt-16 pb-8 text-zinc-600 text-xs max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-zinc-900 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>&copy; {new Date().getFullYear()} ProgrammersArena. All rights reserved.</p>
          <div className="flex gap-4 text-zinc-600">
            <span className="hover:text-zinc-400 cursor-pointer transition">Terms</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-400 cursor-pointer transition">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}