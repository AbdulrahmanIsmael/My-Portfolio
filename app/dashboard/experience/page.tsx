"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSave,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdLanguage,
  MdList,
} from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

interface SubProject {
  id: string;
  en: { name: string; desc: string };
  ar: { name: string; desc: string };
}

interface TranslationFields {
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  achievements?: string[];
}

interface ExperienceItem {
  id: string;
  type: "work" | "training";
  en: TranslationFields;
  ar: TranslationFields;
  projects?: SubProject[];
}

export default function ExperienceCrud() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeExpIndex, setActiveExpIndex] = useState<number>(-1);
  const [expForm, setExpForm] = useState<ExperienceItem>({
    id: "",
    type: "work",
    en: {
      title: "",
      company: "",
      location: "",
      date: "",
      description: "",
      achievements: [],
    },
    ar: {
      title: "",
      company: "",
      location: "",
      date: "",
      description: "",
      achievements: [],
    },
    projects: [],
  });

  // Editor states
  const [activeLangTab, setActiveLangTab] = useState<"en" | "ar">("en");
  const [newAchievementEn, setNewAchievementEn] = useState("");
  const [newAchievementAr, setNewAchievementAr] = useState("");

  // Sub-project edit helper inside modal
  const [newSubProj, setNewSubProj] = useState<SubProject>({
    id: "",
    en: { name: "", desc: "" },
    ar: { name: "", desc: "" },
  });

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch("/api/dashboard/experience");
        if (res.ok) {
          const data = await res.json();
          setExperiences(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch("/api/dashboard/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(experiences),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Experiences database updated successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to save experiences. Verify session keys.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "A connection error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = (index: number) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      const updated = [...experiences];
      updated.splice(index, 1);
      setExperiences(updated);
    }
  };

  const openAddExp = () => {
    setModalMode("add");
    setExpForm({
      id: "",
      type: "work",
      en: {
        title: "",
        company: "",
        location: "",
        date: "",
        description: "",
        achievements: [],
      },
      ar: {
        title: "",
        company: "",
        location: "",
        date: "",
        description: "",
        achievements: [],
      },
      projects: [],
    });
    setNewAchievementEn("");
    setNewAchievementAr("");
    setNewSubProj({
      id: "",
      en: { name: "", desc: "" },
      ar: { name: "", desc: "" },
    });
    setActiveLangTab("en");
    setShowModal(true);
  };

  const openEditExp = (index: number) => {
    setModalMode("edit");
    setActiveExpIndex(index);
    setExpForm(JSON.parse(JSON.stringify(experiences[index]))); // deep copy
    setNewAchievementEn("");
    setNewAchievementAr("");
    setNewSubProj({
      id: "",
      en: { name: "", desc: "" },
      ar: { name: "", desc: "" },
    });
    setActiveLangTab("en");
    setShowModal(true);
  };

  // Achievement list functions
  const addAchievement = () => {
    if (newAchievementEn.trim() && newAchievementAr.trim()) {
      const achievementsEn = expForm.en.achievements || [];
      const achievementsAr = expForm.ar.achievements || [];

      setExpForm({
        ...expForm,
        en: {
          ...expForm.en,
          achievements: [...achievementsEn, newAchievementEn.trim()],
        },
        ar: {
          ...expForm.ar,
          achievements: [...achievementsAr, newAchievementAr.trim()],
        },
      });

      setNewAchievementEn("");
      setNewAchievementAr("");
    } else {
      alert(
        "Please enter the achievement bullet in BOTH languages before adding.",
      );
    }
  };

  const deleteAchievement = (idx: number) => {
    const achievementsEn = expForm.en.achievements || [];
    const achievementsAr = expForm.ar.achievements || [];

    setExpForm({
      ...expForm,
      en: {
        ...expForm.en,
        achievements: achievementsEn.filter((_, i) => i !== idx),
      },
      ar: {
        ...expForm.ar,
        achievements: achievementsAr.filter((_, i) => i !== idx),
      },
    });
  };

  // Freelance project list functions
  const addSubProject = () => {
    if (
      !newSubProj.id.trim() ||
      !newSubProj.en.name.trim() ||
      !newSubProj.ar.name.trim()
    ) {
      alert("Please fill in project ID and name in both English and Arabic.");
      return;
    }

    const currentProjs = expForm.projects || [];
    if (currentProjs.some((p) => p.id === newSubProj.id)) {
      alert("Project with this ID already exists.");
      return;
    }

    setExpForm({
      ...expForm,
      projects: [...currentProjs, { ...newSubProj }],
    });

    setNewSubProj({
      id: "",
      en: { name: "", desc: "" },
      ar: { name: "", desc: "" },
    });
  };

  const removeSubProject = (id: string) => {
    const currentProjs = expForm.projects || [];
    setExpForm({
      ...expForm,
      projects: currentProjs.filter((p) => p.id !== id),
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.id.trim()) {
      alert("Please enter a valid unique Experience ID.");
      return;
    }

    const updated = [...experiences];
    if (modalMode === "add") {
      updated.push(expForm);
    } else {
      updated[activeExpIndex] = expForm;
    }

    setExperiences(updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Experience CRUD
          </h1>
          <p
            className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}
          >
            Configure your professional chronology, internships, training and
            freelance achievements.
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
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 bg-subtleLight/10 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddExp}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white shadow-md transition-all ${
                lightMode
                  ? "bg-accentDark hover:bg-accentHoverDark shadow-accentDark/10"
                  : "bg-accentLight hover:bg-accentHoverLight shadow-accentLight/10"
              }`}
            >
              <MdAdd size={18} />
              <span>Add Experience Entry</span>
            </button>
          </div>

          {experiences.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border ${
                lightMode
                  ? "bg-white border-subtleDark/20"
                  : "bg-black/10 border-subtleLight/10"
              }`}
            >
              <p className="opacity-60 mb-2">No experiences found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
                    lightMode
                      ? "bg-white border-subtleDark/20 hover:border-accentDark shadow-lg shadow-subtleDark/5"
                      : "bg-black/10 border-subtleLight/10 hover:border-accentLight shadow-lg shadow-black/10"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-accentLight/10 text-accentLight dark:bg-accentDark/15 dark:text-accentDark capitalize">
                        {exp.type}
                      </span>
                      <span className="text-xs opacity-50 font-mono">
                        ID: {exp.id}
                      </span>
                      <span className="text-xs opacity-60">
                        • {exp.en.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{exp.en.title}</h3>
                    <h4 className="text-sm font-semibold opacity-85">
                      {exp.en.company} — {exp.en.location}
                    </h4>
                    <p
                      className={`text-xs line-clamp-1 opacity-70 ${lightMode ? "text-textDark/80" : "text-textLight/80"}`}
                    >
                      {exp.en.description}
                    </p>
                    {exp.en.achievements && exp.en.achievements.length > 0 && (
                      <span className="text-[10px] text-accentLight dark:text-accentDark font-bold flex items-center gap-1 mt-1">
                        <MdList size={14} />
                        <span>
                          {exp.en.achievements.length} Bullet Achievements
                        </span>
                      </span>
                    )}
                    {exp.projects && exp.projects.length > 0 && (
                      <span className="text-[10px] text-purple-500 font-bold flex items-center gap-1 mt-1">
                        <MdList size={14} />
                        <span>{exp.projects.length} Sub-projects</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => openEditExp(idx)}
                      title="Edit"
                      className="p-2.5 rounded-xl border border-inherit hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => deleteExperience(idx)}
                      title="Delete"
                      className="p-2.5 rounded-xl border border-inherit hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Experience Add/Edit Modal */}
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
              className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border flex flex-col ${
                lightMode
                  ? "bg-white border-subtleDark/20 text-textDark"
                  : "bg-primaryLight border-subtleLight/20 text-textLight"
              }`}
            >
              <div className="p-6 border-b border-inherit flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">
                  {modalMode === "add"
                    ? "Add Experience Entry"
                    : "Edit Experience Details"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1.5 rounded-lg ${
                    lightMode
                      ? "hover:bg-primaryLight/10"
                      : "hover:bg-primaryDark/10"
                  }`}
                >
                  <MdClose size={22} />
                </button>
              </div>

              <form
                onSubmit={handleModalSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                {/* Meta details: ID, type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Experience ID
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "edit"}
                      value={expForm.id}
                      onChange={(e) =>
                        setExpForm({
                          ...expForm,
                          id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        })
                      }
                      placeholder="e.g. freelance, work, training, ipda3-tech"
                      className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Type
                    </label>
                    <select
                      value={expForm.type}
                      onChange={(e) =>
                        setExpForm({
                          ...expForm,
                          type: e.target.value as "work" | "training",
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                    >
                      <option
                        value="work"
                        className={lightMode ? "bg-white" : "bg-primaryLight"}
                      >
                        Work Experience
                      </option>
                      <option
                        value="training"
                        className={lightMode ? "bg-white" : "bg-primaryLight"}
                      >
                        Training / Academic
                      </option>
                    </select>
                  </div>
                </div>

                {/* Bilingual Fields */}
                <div className="border-t border-inherit pt-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MdLanguage size={16} />
                      <span>Bilingual Description Fields</span>
                    </label>

                    {/* Language Switcher Tabs */}
                    <div className="flex border border-inherit rounded-lg overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveLangTab("en")}
                        className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                          activeLangTab === "en"
                            ? "bg-accentLight text-white"
                            : "hover:bg-primaryLight/5"
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLangTab("ar")}
                        className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                          activeLangTab === "ar"
                            ? "bg-accentLight text-white"
                            : "hover:bg-primaryLight/5"
                        }`}
                      >
                        العربية
                      </button>
                    </div>
                  </div>

                  {/* English Translation Input panel */}
                  {activeLangTab === "en" && (
                    <div className="space-y-4 animate-fadeIn" dir="ltr">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            Job / Course Title (EN)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "en"}
                            value={expForm.en.title}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                en: { ...expForm.en, title: e.target.value },
                              })
                            }
                            placeholder="e.g. Frontend Engineer"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            Company / Entity (EN)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "en"}
                            value={expForm.en.company}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                en: { ...expForm.en, company: e.target.value },
                              })
                            }
                            placeholder="e.g. Taqnit Al-M'alumat"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            Location (EN)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "en"}
                            value={expForm.en.location}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                en: { ...expForm.en, location: e.target.value },
                              })
                            }
                            placeholder="e.g. Mansoura, Egypt"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            Date Range (EN)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "en"}
                            value={expForm.en.date}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                en: { ...expForm.en, date: e.target.value },
                              })
                            }
                            placeholder="e.g. January 2026 - May 2026"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          Core Description (EN)
                        </label>
                        <textarea
                          required={activeLangTab === "en"}
                          value={expForm.en.description}
                          onChange={(e) =>
                            setExpForm({
                              ...expForm,
                              en: {
                                ...expForm.en,
                                description: e.target.value,
                              },
                            })
                          }
                          rows={3}
                          placeholder="Summarize your role and key accomplishments..."
                          className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Arabic Translation Input panel */}
                  {activeLangTab === "ar" && (
                    <div className="space-y-4 animate-fadeIn" dir="rtl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            المسمى الوظيفي (AR)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "ar"}
                            value={expForm.ar.title}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                ar: { ...expForm.ar, title: e.target.value },
                              })
                            }
                            placeholder="مثال: مهندس واجهة أمامية"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            الشركة / الجهة (AR)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "ar"}
                            value={expForm.ar.company}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                ar: { ...expForm.ar, company: e.target.value },
                              })
                            }
                            placeholder="مثال: تقنية المعلومات"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            الموقع (AR)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "ar"}
                            value={expForm.ar.location}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                ar: { ...expForm.ar, location: e.target.value },
                              })
                            }
                            placeholder="مثال: المنصورة، مصر"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            الفترة الزمنية (AR)
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "ar"}
                            value={expForm.ar.date}
                            onChange={(e) =>
                              setExpForm({
                                ...expForm,
                                ar: { ...expForm.ar, date: e.target.value },
                              })
                            }
                            placeholder="مثال: يناير 2026 - مستمر"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-right">
                          الوصف الوظيفي (AR)
                        </label>
                        <textarea
                          required={activeLangTab === "ar"}
                          value={expForm.ar.description}
                          onChange={(e) =>
                            setExpForm({
                              ...expForm,
                              ar: {
                                ...expForm.ar,
                                description: e.target.value,
                              },
                            })
                          }
                          rows={3}
                          placeholder="تفاصيل حول دورك ومسؤولياتك..."
                          className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit resize-none text-right"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Achievements List Form (only if not freelance or type training without projects) */}
                {expForm.id !== "freelance" && (
                  <div className="border-t border-inherit pt-4 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MdList size={18} />
                      <span>Achievement Bullet Points</span>
                    </label>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          English Bullet Text
                        </label>
                        <input
                          type="text"
                          value={newAchievementEn}
                          onChange={(e) => setNewAchievementEn(e.target.value)}
                          placeholder="e.g. Achieved 100% lighthouse scores in SEO..."
                          className="w-full px-4 py-2 rounded-lg border border-inherit outline-none bg-inherit text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Arabic Bullet Text
                        </label>
                        <input
                          type="text"
                          value={newAchievementAr}
                          onChange={(e) => setNewAchievementAr(e.target.value)}
                          placeholder="مثال: تحقيق نسبة 100% في مقاييس Lighthouse..."
                          className="w-full px-4 py-2 rounded-lg border border-inherit outline-none bg-inherit text-sm text-right"
                          dir="rtl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addAchievement}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-accentLight/10 text-accentLight hover:bg-accentLight/20 transition-colors"
                      >
                        Add Bullet Point
                      </button>
                    </div>

                    {/* Render current lists of achievements */}
                    {expForm.en.achievements &&
                      expForm.en.achievements.length > 0 && (
                        <div className="space-y-2 border border-inherit p-4 rounded-xl max-h-48 overflow-y-auto">
                          {expForm.en.achievements.map((ach, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-start gap-4 p-2 rounded-lg bg-subtleLight/5 border border-dashed border-inherit text-xs"
                            >
                              <div className="flex-1 space-y-1">
                                <p className="font-medium">EN: {ach}</p>
                                <p className="opacity-70 text-right" dir="rtl">
                                  AR: {expForm.ar.achievements?.[idx] || ""}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteAchievement(idx)}
                                className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                              >
                                <MdDelete size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {/* Sub-projects form (specific to Freelance) */}
                {expForm.id === "freelance" && (
                  <div className="border-t border-inherit pt-4 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MdList size={18} />
                      <span>Freelance Sub-Projects</span>
                    </label>

                    <div className="p-4 rounded-xl border border-inherit space-y-3 bg-subtleLight/5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase">
                            Sub-Project ID (e.g. project3)
                          </label>
                          <input
                            type="text"
                            value={newSubProj.id}
                            onChange={(e) =>
                              setNewSubProj({
                                ...newSubProj,
                                id: e.target.value
                                  .toLowerCase()
                                  .replace(/\s+/g, ""),
                              })
                            }
                            placeholder="project3"
                            className="w-full px-3 py-1.5 rounded border border-inherit outline-none bg-inherit text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase">
                            Project Name (EN)
                          </label>
                          <input
                            type="text"
                            value={newSubProj.en.name}
                            onChange={(e) =>
                              setNewSubProj({
                                ...newSubProj,
                                en: { ...newSubProj.en, name: e.target.value },
                              })
                            }
                            placeholder="AI agent platform"
                            className="w-full px-3 py-1.5 rounded border border-inherit outline-none bg-inherit text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-right">
                            اسم المشروع بالعربية
                          </label>
                          <input
                            type="text"
                            value={newSubProj.ar.name}
                            onChange={(e) =>
                              setNewSubProj({
                                ...newSubProj,
                                ar: { ...newSubProj.ar, name: e.target.value },
                              })
                            }
                            placeholder="منصة وكلاء الذكاء الاصطناعي"
                            className="w-full px-3 py-1.5 rounded border border-inherit outline-none bg-inherit text-xs text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase">
                            Project Description (EN)
                          </label>
                          <textarea
                            value={newSubProj.en.desc}
                            onChange={(e) =>
                              setNewSubProj({
                                ...newSubProj,
                                en: { ...newSubProj.en, desc: e.target.value },
                              })
                            }
                            rows={2}
                            placeholder="Developed mockup workspace..."
                            className="w-full px-3 py-1.5 rounded border border-inherit outline-none bg-inherit text-xs resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-right">
                            الوصف بالعربية
                          </label>
                          <textarea
                            value={newSubProj.ar.desc}
                            onChange={(e) =>
                              setNewSubProj({
                                ...newSubProj,
                                ar: { ...newSubProj.ar, desc: e.target.value },
                              })
                            }
                            rows={2}
                            placeholder="تطوير واجهات مساحة العمل..."
                            className="w-full px-3 py-1.5 rounded border border-inherit outline-none bg-inherit text-xs resize-none text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addSubProject}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-accentLight/10 text-accentLight hover:bg-accentLight/20 transition-colors"
                      >
                        Add Sub-project
                      </button>
                    </div>

                    {/* Render current freelance sub-projects list */}
                    {expForm.projects && expForm.projects.length > 0 && (
                      <div className="space-y-2 border border-inherit p-4 rounded-xl max-h-48 overflow-y-auto">
                        {expForm.projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="flex justify-between items-start gap-4 p-2 rounded-lg bg-subtleLight/5 border border-dashed border-inherit text-xs"
                          >
                            <div className="flex-1 space-y-1">
                              <p className="font-semibold text-accentLight dark:text-accentDark">
                                {proj.id}: {proj.en.name} / {proj.ar.name}
                              </p>
                              <p className="opacity-70">EN: {proj.en.desc}</p>
                              <p className="opacity-70 text-right" dir="rtl">
                                AR: {proj.ar.desc}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSubProject(proj.id)}
                              className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
