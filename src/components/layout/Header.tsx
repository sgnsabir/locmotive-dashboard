// src/components/Header.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout as logoutAction } from "@/store/authSlice";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getToken, handleResponse } from "@/api/apiHelper";

// Define the navigation item type as returned from the backend.
interface NavigationItem {
  id: string;
  label: string;
  url: string;
}

// SWR fetcher function for navigation items using relative URL.
const fetchNavigation = async (url: string): Promise<NavigationItem[]> => {
  try {
    const token = getToken();
    const response = await fetch(url, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      // Use "include" in production if cookies are needed.
      credentials: process.env.NODE_ENV === "production" ? "include" : "omit",
    });
    return handleResponse<NavigationItem[]>(response);
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
    throw error;
  }
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Use the relative endpoint "/api/navigation" in the SWR hook.
  const { data: navItems, error: navError } = useSWR<NavigationItem[]>(
    `/api/navigation`,
    fetchNavigation,
    { refreshInterval: 60000 }
  );

  const filteredNavItems = navItems
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const [hasUnread, setHasUnread] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Updated to use the relative endpoint "/api/auth/logout".
  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials:
            process.env.NODE_ENV === "production" ? "include" : "omit",
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const closeSearch = () => {
    setSearchQuery("");
  };

  const handleNotificationClick = () => {
    console.info("Notifications clicked.");
    setHasUnread(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white relative shadow-md">
      {/* Left: Mobile Menu Toggle & Logo */}
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <FiMenu className="text-2xl" />
        </button>
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="/images/logo.png"
            alt="Locomotive Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="ml-2 text-xl font-bold">Locomotive Dashboard</span>
        </Link>
      </div>

      {/* Center: Search Bar (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center relative">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none"
          />
        </div>
        {filteredNavItems.length > 0 && (
          <div className="absolute top-12 w-full max-w-md bg-white text-black rounded-md shadow p-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={closeSearch}
                className="block px-2 py-1 hover:bg-gray-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right: Notifications, User Avatar & Info */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleNotificationClick}
          className="relative focus:outline-none"
          aria-label="Notifications"
        >
          <FiBell className="text-2xl" />
          {hasUnread && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
        {user ? (
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <Image
                src={user.avatar || "/images/default-avatar.png"}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full cursor-pointer"
              />
            </Link>
            <span className="hidden sm:block">Hello, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-blue-600 p-4 md:hidden z-50">
          {navError && (
            <p className="text-red-300 mb-2">
              Error loading navigation: {navError.message}
            </p>
          )}
          {!navItems && !navError && (
            <p className="text-gray-300 mb-2">Loading navigation...</p>
          )}
          <ul className="space-y-2">
            {navItems &&
              navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    onClick={toggleMobileMenu}
                    className="block hover:text-blue-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left hover:text-blue-300"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={toggleMobileMenu}
                  className="block hover:text-blue-300"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
