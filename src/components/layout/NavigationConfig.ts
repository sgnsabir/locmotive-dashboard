// src/components/layout/NavigationConfig.ts
export interface NavItem {
  label: string;
  href: string;
}

/**
 * Main navigation items visible to all users.
 * Includes real‑time Tracking and other dashboard pages.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home (Dashboard)", href: "/" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Tracking", href: "/dashboard/tracking" },
  { label: "Track Health", href: "/dashboard/track" },
  { label: "Load & Weight", href: "/dashboard/load" },
  { label: "Alerts", href: "/dashboard/alerts/alerts" },
  { label: "Dynamic Visuals", href: "/dashboard/dynamic-visuals" },
  { label: "Historical", href: "/dashboard/historical" },
  { label: "Maintenance", href: "/dashboard/maintenance" },
];

/**
 * Navigation items for user account management.
 */
export const USER_NAV_ITEMS: NavItem[] = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

/**
 * Additional navigation items available only to admin users.
 */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "User Management & Reports", href: "/user" },
  { label: "Create New User", href: "/user/create" },
];
