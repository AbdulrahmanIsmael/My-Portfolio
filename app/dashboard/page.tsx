"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MdFolder,
  MdStar,
  MdWork,
  MdPerson,
  MdShare,
  MdArrowForward,
} from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

export default function DashboardOverview() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [stats, setStats] = useState({
    skillsCount: 0,
    projectsCount: 0,
    experienceCount: 0,
    socialsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [skillsRes, projectsRes, experienceRes, socialsRes] = await Promise.all([
          fetch("/api/dashboard/skills").then((res) => res.json()),
          fetch("/api/dashboard/projects").then((res) => res.json()),
          fetch("/api/dashboard/experience").then((res) => res.json()),
          fetch("/api/dashboard/socials").then((res) => res.json()),
        ]);

        // Calculate count of skills across categories
        let skillsCount = 0;
        if (Array.isArray(skillsRes)) {
          skillsRes.forEach((cat: { skills?: unknown[] }) => {
            if (Array.isArray(cat.skills)) {
              skillsCount += cat.skills.length;
            }
          });
        }

        setStats({
          skillsCount,
          projectsCount: Array.isArray(projectsRes) ? projectsRes.length : 0,
          experienceCount: Array.isArray(experienceRes) ? experienceRes.length : 0,
          socialsCount: socialsRes ? Object.keys(socialsRes).length : 0,
        });
      } catch (err) {
        console.error("Failed to load statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Projects",
      count: stats.projectsCount,
      description: "Manage case studies and live work",
      icon: MdFolder,
      color: "bg-blue-500",
      href: "/dashboard/projects",
    },
    {
      title: "Skills & Tools",
      count: stats.skillsCount,
      description: "Highlight technologies in your stack",
      icon: MdStar,
      color: "bg-purple-500",
      href: "/dashboard/skills",
    },
    {
      title: "Experience",
      count: stats.experienceCount,
      description: "Work, freelancing, and training history",
      icon: MdWork,
      color: "bg-emerald-500",
      href: "/dashboard/experience",
    },
    {
      title: "Social Links",
      count: stats.socialsCount,
      description: "Social media handles and contact points",
      icon: MdShare,
      color: "bg-orange-500",
      href: "/dashboard/socials",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Welcome back!
        </h1>
        <p className={`text-base ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}>
          Here is an overview of your portfolio content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              lightMode
                ? "bg-white border-subtleDark/20 shadow-lg shadow-subtleDark/5"
                : "bg-black/10 border-subtleLight/10 shadow-lg shadow-black/10"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3.5 rounded-xl ${card.color} text-white`}>
                <card.icon size={24} />
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-subtleLight/20 animate-pulse rounded-md" />
              ) : (
                <span className="text-3xl font-extrabold">{card.count}</span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1">{card.title}</h3>
            <p className={`text-xs mb-4 ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}>
              {card.description}
            </p>
            <Link
              href={card.href}
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                lightMode
                  ? "text-accentDark hover:text-accentHoverDark"
                  : "text-accentLight hover:text-accentHoverLight"
              }`}
            >
              <span>Manage</span>
              <MdArrowForward size={14} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`p-8 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
          lightMode
            ? "bg-white border-subtleDark/20 shadow-lg shadow-subtleDark/5"
            : "bg-black/10 border-subtleLight/10 shadow-lg shadow-black/10"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full bg-accentLight/15 text-accentLight shrink-0`}>
            <MdPerson size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1.5">Personal Profile Details</h3>
            <p className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}>
              Update your name, bio, job description, resume download link, and profile image.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/personal"
          className={`px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-all shrink-0 text-center ${
            lightMode
              ? "bg-accentDark hover:bg-accentHoverDark shadow-accentDark/10"
              : "bg-accentLight hover:bg-accentHoverLight shadow-accentLight/10"
          }`}
        >
          Edit Profile
        </Link>
      </motion.div>
    </div>
  );
}
