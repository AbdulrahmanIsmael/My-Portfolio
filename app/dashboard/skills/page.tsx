"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdStar,
  MdArrowUpward,
  MdArrowDownward,
  MdDelete,
  MdAdd,
  MdSave,
  MdEdit,
  MdClose,
  MdSearch,
} from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

// Selective imports to prevent memory bloat
import * as Si from "react-icons/si";
import * as Pi from "react-icons/pi";
import * as Di from "react-icons/di";
import * as Ri from "react-icons/ri";
import * as Tb from "react-icons/tb";

// Pool of supported icons with their display name and visual component mapping
const ICON_POOL: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  // Frontend
  SiHtml5: Si.SiHtml5,
  SiCss3: Si.SiCss3,
  SiSass: Si.SiSass,
  SiJavascript: Si.SiJavascript,
  SiTypescript: Si.SiTypescript,
  SiReact: Si.SiReact,
  SiAngular: Si.SiAngular,
  SiRedux: Si.SiRedux,
  SiReactrouter: Si.SiReactrouter,
  SiReactquery: Si.SiReactquery,
  SiReacthookform: Si.SiReacthookform,
  TbBrandRedux: Tb.TbBrandRedux,
  SiNextdotjs: Si.SiNextdotjs,
  SiTailwindcss: Si.SiTailwindcss,
  SiBootstrap: Si.SiBootstrap,
  SiExpo: Si.SiExpo,
  TbBrandReactNative: Tb.TbBrandReactNative,
  // Backend
  SiNodedotjs: Si.SiNodedotjs,
  SiPhp: Si.SiPhp,
  SiLaravel: Si.SiLaravel,
  SiMongodb: Si.SiMongodb,
  SiPostgresql: Si.SiPostgresql,
  SiMysql: Si.SiMysql,
  SiDocker: Si.SiDocker,
  SiFirebase: Si.SiFirebase,
  SiSupabase: Si.SiSupabase,
  SiGraphql: Si.SiGraphql,
  // Tools
  SiGit: Si.SiGit,
  SiWebpack: Si.SiWebpack,
  SiGulp: Si.SiGulp,
  SiPug: Si.SiPug,
  SiFigma: Si.SiFigma,
  DiVisualstudio: Di.DiVisualstudio,
  RiCursorLine: Ri.RiCursorLine,
  SiNpm: Si.SiNpm,
  SiYarn: Si.SiYarn,
  SiPostman: Si.SiPostman,
  // Office
  PiMicrosoftWordLogo: Pi.PiMicrosoftWordLogo,
  PiMicrosoftExcelLogo: Pi.PiMicrosoftExcelLogo,
  PiMicrosoftPowerpointLogo: Pi.PiMicrosoftPowerpointLogo,
  // Operating Systems
  PiWindowsLogo: Pi.PiWindowsLogo,
  SiLinux: Si.SiLinux,
  SiApple: Si.SiApple,
};

interface Skill {
  name: string;
  icon: string;
  color: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

export default function SkillsManager() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Modal / Form state for adding/editing a skill
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(-1);
  const [activeSkillIndex, setActiveSkillIndex] = useState<number>(-1);
  const [skillForm, setSkillForm] = useState<Skill>({
    name: "",
    icon: "SiReact",
    color: "#61DAFB",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/dashboard/skills");
        if (res.ok) {
          const data = await res.ok ? await res.json() : [];
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch("/api/dashboard/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Skills updated successfully!" });
      } else {
        setStatus({ type: "error", message: "Failed to save skills. Please check your credentials." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "A network error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // Reordering functions
  const moveSkill = (catIdx: number, skillIdx: number, direction: "up" | "down") => {
    const updated = [...categories];
    const category = updated[catIdx];
    const targetIdx = direction === "up" ? skillIdx - 1 : skillIdx + 1;

    if (targetIdx < 0 || targetIdx >= category.skills.length) return;

    // Swap elements
    const temp = category.skills[skillIdx];
    category.skills[skillIdx] = category.skills[targetIdx];
    category.skills[targetIdx] = temp;

    setCategories(updated);
  };

  const deleteSkill = (catIdx: number, skillIdx: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const updated = [...categories];
      updated[catIdx].skills.splice(skillIdx, 1);
      setCategories(updated);
    }
  };

  const openAddSkill = (catIdx: number) => {
    setModalMode("add");
    setActiveCategoryIndex(catIdx);
    setSkillForm({ name: "", icon: "SiReact", color: "#61DAFB" });
    setSearchQuery("");
    setShowModal(true);
  };

  const openEditSkill = (catIdx: number, skillIdx: number) => {
    setModalMode("edit");
    setActiveCategoryIndex(catIdx);
    setActiveSkillIndex(skillIdx);
    setSkillForm({ ...categories[catIdx].skills[skillIdx] });
    setSearchQuery("");
    setShowModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) return;

    const updated = [...categories];
    if (modalMode === "add") {
      updated[activeCategoryIndex].skills.push(skillForm);
    } else {
      updated[activeCategoryIndex].skills[activeSkillIndex] = skillForm;
    }

    setCategories(updated);
    setShowModal(false);
  };

  const filteredIcons = Object.keys(ICON_POOL).filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Skills Manager</h1>
          <p className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}>
            Group your expertise by categories and pick specific brand icons.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white shadow-md transition-all ${
            lightMode
              ? "bg-accentDark hover:bg-accentHoverDark shadow-accentDark/10"
              : "bg-accentLight hover:bg-accentHoverLight shadow-accentLight/10"
          }`}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MdSave size={18} />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {status.message && (
        <div
          className={`p-4 rounded-xl border text-sm ${
            status.type === "success"
              ? "bg-green-500/15 border-green-500/25 text-green-500 dark:text-green-400"
              : "bg-red-500/15 border-red-500/25 text-red-500 dark:text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-subtleLight/10 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat, catIdx) => (
            <div
              key={cat.category}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                lightMode
                  ? "bg-white border-subtleDark/25 shadow-lg shadow-subtleDark/5"
                  : "bg-black/10 border-subtleLight/10 shadow-lg shadow-black/10"
              }`}
            >
              {/* Category Header */}
              <div className="flex justify-between items-center mb-6 border-b border-inherit pb-3">
                <h3 className="text-xl font-bold uppercase tracking-wider text-accentLight dark:text-accentDark">
                  {cat.category}
                </h3>
                <button
                  onClick={() => openAddSkill(catIdx)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-inherit hover:bg-accentLight hover:text-white transition-colors`}
                >
                  <MdAdd size={16} />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills Grid */}
              {cat.skills.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-6">No skills in this category. Click &apos;Add Skill&apos; to get started.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.skills.map((skill, skillIdx) => {
                    const IconComp = ICON_POOL[skill.icon] || MdStar;
                    return (
                      <div
                        key={skill.name}
                        className={`flex items-center justify-between p-3.5 rounded-xl border ${
                          lightMode
                            ? "bg-primaryDark/50 border-subtleDark/15 hover:bg-primaryDark"
                            : "bg-primaryLight/20 border-subtleLight/10 hover:bg-primaryLight/40"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-lg text-white"
                            style={{ backgroundColor: skill.color + "22", color: skill.color }}
                          >
                            <IconComp size={22} />
                          </div>
                          <span className="font-semibold text-sm">{skill.name}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => moveSkill(catIdx, skillIdx, "up")}
                            disabled={skillIdx === 0}
                            title="Move Up"
                            className="p-1 hover:text-accentLight disabled:opacity-30 disabled:hover:text-inherit"
                          >
                            <MdArrowUpward size={16} />
                          </button>
                          <button
                            onClick={() => moveSkill(catIdx, skillIdx, "down")}
                            disabled={skillIdx === cat.skills.length - 1}
                            title="Move Down"
                            className="p-1 hover:text-accentLight disabled:opacity-30 disabled:hover:text-inherit"
                          >
                            <MdArrowDownward size={16} />
                          </button>
                          <button
                            onClick={() => openEditSkill(catIdx, skillIdx)}
                            title="Edit"
                            className="p-1 hover:text-blue-500"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => deleteSkill(catIdx, skillIdx)}
                            title="Delete"
                            className="p-1 hover:text-red-500"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border flex flex-col ${
                lightMode
                  ? "bg-white border-subtleDark/20 text-textDark"
                  : "bg-primaryLight border-subtleLight/20 text-textLight"
              }`}
            >
              <div className="p-6 border-b border-inherit flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">
                  {modalMode === "add" ? "Add New Skill" : "Edit Skill"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1.5 rounded-lg ${
                    lightMode ? "hover:bg-primaryLight/10" : "hover:bg-primaryDark/10"
                  }`}
                >
                  <MdClose size={22} />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      required
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="e.g. Node.js"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Brand Theme Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={skillForm.color}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        className="h-10 w-12 rounded-lg border border-inherit cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={skillForm.color}
                        onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                        placeholder="#ffffff"
                        className={`flex-1 px-4 py-2.5 rounded-lg border outline-none ${
                          lightMode
                            ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                            : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Searchable Brand Icon Grid */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Pick Brand Icon
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search icons..."
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none text-sm ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                    <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                  </div>

                  <div
                    className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3 rounded-lg max-h-48 overflow-y-auto border ${
                      lightMode ? "bg-primaryDark/30 border-subtleDark/15" : "bg-primaryLight/30 border-subtleLight/10"
                    }`}
                  >
                    {filteredIcons.map((name) => {
                      const Icon = ICON_POOL[name];
                      const isSelected = skillForm.icon === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, icon: name })}
                          title={name}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                            isSelected
                              ? lightMode
                                ? "bg-accentDark border-accentDark text-white"
                                : "bg-accentLight border-accentLight text-white"
                              : lightMode
                              ? "bg-white border-subtleDark/10 text-textDark hover:bg-primaryLight/5"
                              : "bg-black/20 border-subtleLight/10 text-textLight hover:bg-primaryDark/5"
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-[9px] mt-1 text-center truncate max-w-full font-mono">
                            {name.replace("Si", "").replace("Pi", "").replace("Tb", "").replace("Di", "").replace("Ri", "")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-inherit shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-inherit text-sm font-semibold hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-colors ${
                      lightMode
                        ? "bg-accentDark hover:bg-accentHoverDark"
                        : "bg-accentLight hover:bg-accentHoverLight"
                    }`}
                  >
                    {modalMode === "add" ? "Add" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
