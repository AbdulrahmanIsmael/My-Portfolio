"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const router = useRouter();
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please check your network and try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
        lightMode
          ? "bg-primaryDark text-textDark"
          : "bg-primaryLight text-textLight"
      }`}
      style={{
        backgroundImage: lightMode
          ? "radial-gradient(circle at 10% 20%, rgba(0, 112, 243, 0.05) 0%, transparent 90%)"
          : "radial-gradient(circle at 10% 20%, rgba(121, 40, 202, 0.15) 0%, transparent 90%)",
      }}
    >
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentLight/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondaryLight/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div
          className={`p-8 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-300 ${
            lightMode
              ? "bg-white/80 border-subtleDark/20 shadow-subtleDark/15"
              : "bg-black/40 border-subtleLight/20 shadow-black/40"
          }`}
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className={`p-4 rounded-full mb-4 ${
                lightMode
                  ? "bg-accentDark/10 text-accentDark"
                  : "bg-accentLight/15 text-accentLight"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-center tracking-tight mb-2">
              Portfolio Admin
            </h1>
            <p
              className={`text-sm text-center ${
                lightMode ? "text-textDark/60" : "text-textLight/60"
              }`}
            >
              Enter your password to manage your portfolio data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3.5 rounded-xl outline-none transition-all border ${
                    lightMode
                      ? "bg-primaryDark/50 border-subtleDark/20 focus:border-accentDark focus:bg-white"
                      : "bg-primaryLight/30 border-subtleLight/20 focus:border-accentLight focus:bg-black/50"
                  }`}
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity p-1 rounded-md outline-none"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg text-sm bg-red-500/15 border border-red-500/20 text-red-500 dark:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                lightMode
                  ? "bg-accentDark hover:bg-accentHoverDark text-white"
                  : "bg-accentLight hover:bg-accentHoverLight text-white"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
