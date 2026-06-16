"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard,
  MdPerson,
  MdSettings,
  MdStar,
  MdWork,
  MdShare,
  MdFolder,
  MdLogout,
  MdMenu,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdHome,
} from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lightMode, toggleLightMode } = useAppStore((state) => state as I_appStore);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip rendering sidebar layout for the login page
  const isLoginPage = pathname === "/dashboard/login";

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: MdDashboard },
    { name: "Personal Details", href: "/dashboard/personal", icon: MdPerson },
    { name: "Skills Manager", href: "/dashboard/skills", icon: MdStar },
    { name: "Projects CRUD", href: "/dashboard/projects", icon: MdFolder },
    { name: "Experience CRUD", href: "/dashboard/experience", icon: MdWork },
    { name: "Social Links", href: "/dashboard/socials", icon: MdShare },
    { name: "Files & CV", href: "/dashboard/files", icon: MdSettings },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        const res = await fetch("/api/dashboard/logout", { method: "POST" });
        if (res.ok) {
          router.push("/dashboard/login");
          router.refresh();
        }
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${lightMode
          ? "bg-primaryDark text-textDark"
          : "bg-primaryLight text-textLight"
        }`}
    >
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r shrink-0 transition-colors duration-300 ${lightMode
            ? "bg-white border-subtleDark/20 text-textDark"
            : "bg-black/20 border-subtleLight/20 text-textLight"
          }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-inherit flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold tracking-wider flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accentLight text-white"><MdDashboard size={20} /></span>
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? lightMode
                      ? "bg-accentDark text-white shadow-md shadow-accentDark/20"
                      : "bg-accentLight text-white shadow-md shadow-accentLight/20"
                    : lightMode
                      ? "hover:bg-primaryLight/10 text-textDark/80 hover:text-textDark"
                      : "hover:bg-primaryDark/10 text-textLight/80 hover:text-textLight"
                  }`}
              >
                <item.icon size={20} className="shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-inherit space-y-2">
          <button
            onClick={toggleLightMode}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
              }`}
          >
            {lightMode ? (
              <>
                <MdDarkMode size={20} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <MdLightMode size={20} fill="yellow" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
              }`}
          >
            <MdHome size={20} />
            <span>Go to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <MdLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={`md:hidden flex items-center justify-between p-4 border-b transition-colors duration-300 ${lightMode
            ? "bg-white border-subtleDark/20"
            : "bg-primaryLight border-subtleLight/20"
          }`}
      >
        <Link href="/dashboard" className="text-lg font-bold tracking-wider flex items-center gap-2">
          <span className="p-1 rounded-md bg-accentLight text-white"><MdDashboard size={16} /></span>
          <span>Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`p-2 rounded-lg border border-transparent hover:border-inherit ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
            }`}
        >
          <MdMenu size={24} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            {/* Side Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 flex flex-col md:hidden border-r shadow-2xl transition-colors duration-300 ${lightMode
                  ? "bg-white border-subtleDark/20 text-textDark"
                  : "bg-primaryLight border-subtleLight/20 text-textLight"
                }`}
            >
              <div className="p-6 border-b border-inherit flex items-center justify-between">
                <span className="text-xl font-bold tracking-wider">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2 rounded-lg ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
                    }`}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${isActive
                          ? lightMode
                            ? "bg-accentDark text-white"
                            : "bg-accentLight text-white"
                          : lightMode
                            ? "hover:bg-primaryLight/10"
                            : "hover:bg-primaryDark/10"
                        }`}
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-inherit space-y-2">
                <button
                  onClick={() => {
                    toggleLightMode();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
                    }`}
                >
                  {lightMode ? (
                    <>
                      <MdDarkMode size={20} />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <MdLightMode size={20} fill="yellow" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
                <Link
                  href="/"
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
                    }`}
                >
                  <MdHome size={20} />
                  <span>Go to Site</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <MdLogout size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
