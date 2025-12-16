"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Extract current role from pathname
    const pathParts = pathname?.split("/") || [];
    const role = pathParts[1];

    // Determine search target based on current page
    let searchPath = `/${role}/orders?search=${encodeURIComponent(
      searchQuery
    )}`;

    if (pathname?.includes("/orders")) {
      searchPath = `/${role}/orders?search=${encodeURIComponent(searchQuery)}`;
    } else if (pathname?.includes("/cars")) {
      searchPath = `/${role}/cars?search=${encodeURIComponent(searchQuery)}`;
    } else if (pathname?.includes("/warehouse")) {
      searchPath = `/${role}/warehouse?search=${encodeURIComponent(
        searchQuery
      )}`;
    } else if (pathname?.includes("/mechanics")) {
      searchPath = `/${role}/mechanics?search=${encodeURIComponent(
        searchQuery
      )}`;
    } else if (pathname?.includes("/customers")) {
      searchPath = `/${role}/customers?search=${encodeURIComponent(
        searchQuery
      )}`;
    } else if (pathname?.includes("/users")) {
      searchPath = `/${role}/users?search=${encodeURIComponent(searchQuery)}`;
    }

    router.push(searchPath);
    setSearchQuery("");
  };

  return (
    <form className="search-box" onSubmit={handleSearch}>
      <Search className="mic-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search orders, cars, or parts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
