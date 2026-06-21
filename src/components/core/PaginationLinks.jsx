import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function PaginationLinks({ meta, onPageClick }) {
  function onClick(ev, link) {
    ev.preventDefault();
    if (!link.url) {
      return;
    }
    onPageClick(link);
  }

  // Utility function to construct URL with existing query parameters
  const constructUrl = (page) => {
    const url = new URL(meta.path, window.location.origin);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    url.search = params.toString();
    return url.toString();
  };

  const renderPageNumbers = () => {
    const pages = [];
    const currentPage = meta.current_page;
    const totalPages = meta.last_page;

    // Add Previous link if not on the first page
    if (currentPage > 1) {
      pages.push({
        label: "Öňki",
        url: constructUrl(currentPage - 1),
      });
    }

    // Add first page link if needed
    if (currentPage > 2) {
      pages.push({
        label: "1",
        url: constructUrl(1),
      });
      if (currentPage > 3) {
        pages.push({
          label: "...",
          url: null,
        });
      }
    }

    // Add the current and neighboring pages
    if (currentPage > 1) {
      pages.push({
        label: (currentPage - 1).toString(),
        url: constructUrl(currentPage - 1),
      });
    }

    pages.push({
      label: currentPage.toString(),
      url: constructUrl(currentPage),
      active: true,
    });

    if (currentPage < totalPages) {
      pages.push({
        label: (currentPage + 1).toString(),
        url: constructUrl(currentPage + 1),
      });
    }

    // Add last page link if needed
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push({
          label: "...",
          url: null,
        });
      }
      pages.push({
        label: totalPages.toString(),
        url: constructUrl(totalPages),
      });
    }

    // Add Next link if not on the last page
    if (currentPage < totalPages) {
      pages.push({
        label: "Indiki",
        url: constructUrl(currentPage + 1),
      });
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-md mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        {meta.links[0]?.url && (
          <a
            href="#"
            onClick={(ev) =>
              onClick(ev, {
                label: "Öňki",
                url: constructUrl(meta.current_page - 1),
              })
            }
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </a>
        )}
        {meta.links[meta.links.length - 1]?.url && (
          <a
            href="#"
            onClick={(ev) =>
              onClick(ev, {
                label: "Indiki",
                url: constructUrl(meta.current_page + 1),
              })
            }
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-700">
            <span className="font-medium">{meta.from}{"-"}{meta.to}{" of "}{meta.total}</span>
          </p>
        </div>
        <div>
          {meta.total > meta.per_page && (
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {renderPageNumbers().map((link, ind) => (
                <a
                  href="#"
                  onClick={(ev) => onClick(ev, link)}
                  key={ind}
                  aria-current={link.active ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-xs font-semibold ${ind === 0 ? "rounded-l-md " : ""
                    }${ind === renderPageNumbers().length - 1
                      ? "rounded-r-md "
                      : ""
                    }${link.active
                      ? "bg-gray-800 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                ></a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
