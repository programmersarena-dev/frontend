import React, { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function PaginationLinks({ meta, onPageClick }) {
  if (!meta || !meta.total || meta.total <= meta.per_page) {
    return null;
  }

  const { current_page: currentPage, last_page: totalPages, from, to, total } = meta;

  // Safely construct URL preserving existing query params
  const constructUrl = (page) => {
    try {
      const url = new URL(meta.path || window.location.pathname, window.location.origin);
      const params = new URLSearchParams(window.location.search);
      params.set("page", page);
      url.search = params.toString();
      return url.toString();
    } catch (e) {
      return `?page=${page}`;
    }
  };

  const handleLinkClick = (ev, link) => {
    ev.preventDefault();
    if (!link || !link.url || link.active) return;
    if (onPageClick) {
      onPageClick(link);
    }
  };

  // Generate page links list
  const pages = useMemo(() => {
    const list = [];

    // Previous link
    list.push({
      label: "Öňki",
      url: currentPage > 1 ? constructUrl(currentPage - 1) : null,
      isPrev: true,
    });

    // First page
    if (currentPage > 2) {
      list.push({ label: "1", url: constructUrl(1) });
      if (currentPage > 3) {
        list.push({ label: "...", url: null });
      }
    }

    // Previous neighbor page
    if (currentPage > 1) {
      list.push({
        label: (currentPage - 1).toString(),
        url: constructUrl(currentPage - 1),
      });
    }

    // Current page
    list.push({
      label: currentPage.toString(),
      url: constructUrl(currentPage),
      active: true,
    });

    // Next neighbor page
    if (currentPage < totalPages) {
      list.push({
        label: (currentPage + 1).toString(),
        url: constructUrl(currentPage + 1),
      });
    }

    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        list.push({ label: "...", url: null });
      }
      list.push({
        label: totalPages.toString(),
        url: constructUrl(totalPages),
      });
    }

    // Next link
    list.push({
      label: "Indiki",
      url: currentPage < totalPages ? constructUrl(currentPage + 1) : null,
      isNext: true,
    });

    return list;
  }, [currentPage, totalPages, meta.path]);

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 mt-4">
      {/* Mobile Controls */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={(ev) =>
            handleLinkClick(ev, {
              label: "Öňki",
              url: currentPage > 1 ? constructUrl(currentPage - 1) : null,
            })
          }
          className="relative inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeftIcon className="mr-1.5 h-4 w-4 text-slate-500" />
          Öňki
        </button>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={(ev) =>
            handleLinkClick(ev, {
              label: "Indiki",
              url: currentPage < totalPages ? constructUrl(currentPage + 1) : null,
            })
          }
          className="relative ml-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Indiki
          <ChevronRightIcon className="ml-1.5 h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-600">
            Görkezilýär <span className="font-semibold text-slate-900">{from || 0}</span> -{" "}
            <span className="font-semibold text-slate-900">{to || 0}</span> / Jemi{" "}
            <span className="font-semibold text-slate-900">{total}</span>
          </p>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
            {pages.map((link, ind) => {
              const isFirst = ind === 0;
              const isLast = ind === pages.length - 1;
              const isEllipsis = link.label === "...";

              if (isEllipsis) {
                return (
                  <span
                    key={ind}
                    className="relative inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-400 border border-slate-200 bg-white select-none"
                  >
                    ...
                  </span>
                );
              }

              return (
                <a
                  key={ind}
                  href={link.url || "#"}
                  onClick={(ev) => handleLinkClick(ev, link)}
                  aria-current={link.active ? "page" : undefined}
                  aria-disabled={!link.url}
                  className={`relative inline-flex items-center px-3.5 py-2 text-xs font-semibold transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isFirst ? "rounded-l-lg " : ""
                  }${isLast ? "rounded-r-lg " : ""}${
                    link.active
                      ? "bg-slate-900 text-white border border-slate-900 shadow-sm"
                      : link.url
                      ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      : "bg-slate-50 text-slate-300 border border-slate-200 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  {link.isPrev && <ChevronLeftIcon className="mr-1 h-3.5 w-3.5" />}
                  {link.label}
                  {link.isNext && <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}