// src/components/Layout/Sidebar.tsx
import React, { FC } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Sidebar: FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <aside className="hidden md:block w-64 min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-wide">
          Locomotive Dashboard
        </h2>
      </div>
      <nav>
        <ul className="space-y-3">
          <li>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Home (Dashboard)
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/performance"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Train Performance
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/energy"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Fuel & Energy Efficiency
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/track"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Track & Infrastructure Health
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/load"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Load & Weight Distribution
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/tracking"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Train Tracking & Safety
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/maintenance"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Predictive Maintenance
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/alerts/alerts"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Alerts & Anomalies
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Settings & Configurations
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/historical"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Historical Data
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/dynamic-visuals"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Dynamic Visualizations
            </Link>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  href="/user"
                  className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  User Management & Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/user/create"
                  className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Create New User
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
