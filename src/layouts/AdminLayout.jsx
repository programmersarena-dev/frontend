import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  FolderIcon,
  MegaphoneIcon,
  TrophyIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import NotFound from "@/components/core/NotFound";

const navigation = [
  { name: "Baş sahypa", to: "/admin/dashboard", icon: HomeIcon },
  { name: "File Manager", to: "/admin/files", icon: FolderIcon },
  { name: "Bildirişler", to: "/admin/blogs", icon: MegaphoneIcon },
  { name: "Bäsleşikler", to: "/admin/contests", icon: TrophyIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const userDashboardTo = currentUser?.name ? `/profile/${currentUser.handle}` : "/";

  if (currentUser?.user_type !== "admin") {
    return <NotFound />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      <aside className="w-64 flex flex-col bg-white border-r border-slate-200/80 flex-shrink-0">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <img
            className="h-8 w-8 object-contain"
            src="/logo.png"
            alt="ProgrammersArena"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              ProgrammersArena
            </span>
            <span className="text-xs font-medium text-emerald-600">
              Admin Dashboard
            </span>
          </div>
        </div>

        <div className="px-3 pt-3">
          <Link
            to={userDashboardTo}
            className="group flex items-center px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <ArrowLeftIcon className="mr-2.5 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            Ulanyjy paneli
          </Link>
        </div>

        <nav className="flex-1 px-3 pt-2 pb-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to !== "/admin/dashboard" && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={classNames(
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium",
                  "group flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-150"
                )}
              >
                <Icon
                  className={classNames(
                    isActive
                      ? "text-slate-900"
                      : "text-slate-400 group-hover:text-slate-600",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
            <Link
              to={userDashboardTo}
              className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
            >
              <UserCircleIcon className="h-8 w-8 text-slate-400 flex-shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {currentUser?.name || "Admin"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || "Administrator"}
                </p>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Çykmak"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 md:p-8 w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-8 border-t border-slate-200/60 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} ProgrammersArena. Ähli haklary goralan.</p>
            <p className="font-medium text-slate-500">v1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}