// src/components/Layout/Header.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/authSlice";

const mockItems = [
  { id: "perf", label: "Performance Page", url: "/dashboard/performance" },
  { id: "energy", label: "Energy Page", url: "/dashboard/energy" },
  { id: "track", label: "Track Health Page", url: "/dashboard/track" },
  { id: "alerts", label: "Alerts Page", url: "/dashboard/alerts" },
];

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockItems>([]);
  const [hasUnread, setHasUnread] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    const filtered = mockItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const closeSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleNotificationClick = () => {
    alert("You have viewed your notifications.");
    setHasUnread(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white relative shadow-md">
      {/* Left: Mobile Menu Toggle & Logo */}
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
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
            className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-12 w-full max-w-md bg-white text-black rounded-md shadow p-2">
            {searchResults.map((res) => (
              <Link
                key={res.id}
                href={res.url}
                onClick={closeSearch}
                className="block px-2 py-1 hover:bg-gray-200"
              >
                {res.label}
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
          <ul className="space-y-2">
            {[
              { label: "Home (Dashboard)", href: "/" },
              // You can add more mobile-specific nav items if needed
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
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
