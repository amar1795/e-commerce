  "use client";
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import { useEffect, useState } from "react";
  import React from "react";

  export function PaginationComponent({ currentOrderPage, totalPages, onPageChange }) {
    const [currentPage, setCurrentPage] = useState(currentOrderPage);


     // Effect to initialize currentPage from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page") || "1", 10);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page); // Notify parent component about page change
    } else {
      setCurrentPage(1);
      onPageChange(1);
    }
  }, [totalPages, onPageChange]);

    // Function to handle page change
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        onPageChange(page); // Notify parent component about page change
        updateUrl(page); // Update URL with new page
      }
    };

    // Function to update URL
    const updateUrl = (page) => {
      const urlParams = new URLSearchParams(window.location.search);
      if (page !== 1) {
        urlParams.set("page", page.toString());
      } else {
        urlParams.delete("page");
      }
      window.history.pushState({}, "", `${window.location.pathname}?${urlParams}`);
    };

    // Function to generate visible pages with ellipses
    const generateVisiblePages = () => {
      const numAdjacentPages = 2; // Number of pages adjacent to current page to show
      const numPagesToShow = numAdjacentPages * 2 + 1; // Total number of pages to show

      let startPage = Math.max(2, currentPage - numAdjacentPages);
      let endPage = Math.min(totalPages, currentPage + numAdjacentPages);

      let pages = [];

      // Always show the first page
      pages.push(1);

      // Show ellipsis if there are pages before the visible range
      if (startPage > 2) {
        pages.push(null); // null indicates ellipsis
      }

      // Add the visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Remove duplicate last page if it's already included
    if (pages.length > 1 && pages[pages.length - 1] === totalPages) {
      pages.pop(); // Remove the last element (duplicate totalPages)
    }
      // Show ellipsis if there are pages after the visible range
      if (endPage < totalPages - 1) {
        pages.push(null); // null indicates ellipsis
      }

      // Always show the last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    // Get visible pages
    const visiblePages = generateVisiblePages();

    return (
      <div className="mt-5 mb-3">
        <Pagination>
          <PaginationContent className="w-[30rem] flex justify-between below-426:w-[21rem] ">
            {/* Previous Button */}
            <div className="first previous">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:bg-black hover:text-white"
              >
                <PaginationItem>
                  <PaginationPrevious className="hover:bg-black hover:text-white " />
                </PaginationItem>
              </button>
            </div>

            {/* Middle Pages */}
            <div className="mid flex">
              {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === null ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`hover:bg-black hover:text-white   ${
                        currentPage === page ? "bg-black text-white" : ""
                      }`}
                    >
                      <PaginationItem>
                        <PaginationLink className="hover:bg-black hover:text-white">
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Button */}
            <div className="last next">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="hover:bg-black hover:text-white"
              >
                <PaginationItem>
                  <PaginationNext className="hover:bg-black hover:text-white" />
                </PaginationItem>
              </button>
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
