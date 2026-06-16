"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSave,
  MdAdd,
  MdEdit,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
  MdClose,
  MdLanguage,
  MdCode,
} from "react-icons/md";
import Image from "next/image";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

interface TranslationFields {
  title: string;
  description: string;
  category: string;
}

interface Project {
  id: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  en: TranslationFields;
  ar: TranslationFields;
}

export default function ProjectsCrud() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(-1);
  const [projectForm, setProjectForm] = useState<Project>({
    id: "",
    image: "/assets/images/cinema.png",
    tech: [],
    liveUrl: "",
    githubUrl: "",
    en: { title: "", description: "", category: "" },
    ar: { title: "", description: "", category: "" },
  });

  // Editor states
  const [activeLangTab, setActiveLangTab] = useState<"en" | "ar">("en");
  const [newTechTag, setNewTechTag] = useState("");
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/dashboard/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(projects),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Projects database updated successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message:
            "Failed to save projects. Please verify session configurations.",
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

  const moveProject = (index: number, direction: "up" | "down") => {
    const updated = [...projects];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setProjects(updated);
  };

  const deleteProject = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = [...projects];
      updated.splice(index, 1);
      setProjects(updated);
    }
  };

  const openAddProject = () => {
    setModalMode("add");
    // Generate a unique ID (e.g., max current ID + 1)
    const nextId =
      projects.length > 0
        ? String(Math.max(...projects.map((p) => Number(p.id) || 0)) + 1)
        : "1";

    setProjectForm({
      id: nextId,
      image: "/assets/images/seafarer-management-system.png",
      tech: [],
      liveUrl: "",
      githubUrl: "",
      en: { title: "", description: "", category: "" },
      ar: { title: "", description: "", category: "" },
    });
    setNewTechTag("");
    setActiveLangTab("en");
    setShowModal(true);
  };

  const openEditProject = (index: number) => {
    setModalMode("edit");
    setActiveProjectIndex(index);
    setProjectForm(JSON.parse(JSON.stringify(projects[index]))); // deep copy
    setNewTechTag("");
    setActiveLangTab("en");
    setShowModal(true);
  };

  const addTechTag = () => {
    if (newTechTag.trim() && !projectForm.tech.includes(newTechTag.trim())) {
      setProjectForm({
        ...projectForm,
        tech: [...projectForm.tech, newTechTag.trim()],
      });
      setNewTechTag("");
    }
  };

  const removeTechTag = (tag: string) => {
    setProjectForm({
      ...projectForm,
      tech: projectForm.tech.filter((t) => t !== tag),
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.en.title || !projectForm.ar.title) {
      alert("Project title is required in both English and Arabic.");
      return;
    }

    const updated = [...projects];
    if (modalMode === "add") {
      updated.push(projectForm);
    } else {
      updated[activeProjectIndex] = projectForm;
    }

    setProjects(updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Projects CRUD
          </h1>
          <p
            className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}
          >
            Manage showcase projects, technologies used, and English/Arabic
            translation keys.
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
              onClick={openAddProject}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white shadow-md transition-all ${
                lightMode
                  ? "bg-accentDark hover:bg-accentHoverDark shadow-accentDark/10"
                  : "bg-accentLight hover:bg-accentHoverLight shadow-accentLight/10"
              }`}
            >
              <MdAdd size={18} />
              <span>Add New Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div
              className={`p-12 text-center rounded-2xl border ${
                lightMode
                  ? "bg-white border-subtleDark/20"
                  : "bg-black/10 border-subtleLight/10"
              }`}
            >
              <p className="opacity-60 mb-2">No projects found.</p>
              <p className="text-xs opacity-50">
                Click &quot;Add New Project&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${
                    lightMode
                      ? "bg-white border-subtleDark/20 hover:border-accentDark shadow-lg shadow-subtleDark/5"
                      : "bg-black/10 border-subtleLight/10 hover:border-accentLight shadow-lg shadow-black/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Small image thumb */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-inherit relative bg-subtleLight/15 flex items-center justify-center">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.en.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs opacity-50">No Image</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accentLight/10 text-accentLight dark:bg-accentDark/15 dark:text-accentDark">
                          {project.en.category || "No Category"}
                        </span>
                        <span className="text-xs opacity-50 font-mono">
                          ID: {project.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">
                        {project.en.title || "Untitled Project"}
                      </h3>
                      <p
                        className={`text-xs line-clamp-1 opacity-70 ${lightMode ? "text-textDark/80" : "text-textLight/80"}`}
                      >
                        {project.en.description || "No description provided."}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tech.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-subtleLight/15 opacity-80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => moveProject(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-2.5 rounded-xl border border-inherit hover:bg-accentLight/10 disabled:opacity-30 transition-colors"
                    >
                      <MdArrowUpward size={18} />
                    </button>
                    <button
                      onClick={() => moveProject(idx, "down")}
                      disabled={idx === projects.length - 1}
                      title="Move Down"
                      className="p-2.5 rounded-xl border border-inherit hover:bg-accentLight/10 disabled:opacity-30 transition-colors"
                    >
                      <MdArrowDownward size={18} />
                    </button>
                    <button
                      onClick={() => openEditProject(idx)}
                      title="Edit"
                      className="p-2.5 rounded-xl border border-inherit hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => deleteProject(idx)}
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

      {/* Project Add/Edit Modal */}
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
                    ? "Add New Project"
                    : "Edit Project Details"}
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
                {/* Meta details: ID, image path, Live, Github */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Project ID
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "edit"}
                      value={projectForm.id}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, id: e.target.value })
                      }
                      placeholder="e.g. 11"
                      className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Image URL / Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={projectForm.image}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            image: e.target.value,
                          })
                        }
                        placeholder="e.g. /assets/images/cinema.png"
                        className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="projectImageUpload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setIsUploadingImg(true);
                          const formData = new FormData();
                          formData.append("projectImage", file);

                          try {
                            const res = await fetch(
                              "/api/dashboard/upload-project-image",
                              {
                                method: "POST",
                                body: formData,
                              },
                            );
                            const data = await res.json();
                            if (res.ok && data.path) {
                              setProjectForm({
                                ...projectForm,
                                image: data.path,
                              });
                            } else {
                              alert(data.error || "Failed to upload image");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Network error occurred during upload.");
                          } finally {
                            setIsUploadingImg(false);
                            // reset input so the same file can be selected again if needed
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={isUploadingImg}
                        onClick={() =>
                          document.getElementById("projectImageUpload")?.click()
                        }
                        className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-subtleLight/15 hover:bg-subtleLight/30 transition-colors shrink-0 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploadingImg ? "Uploading..." : "Upload File"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Live Demo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      required
                      value={projectForm.githubUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/user/repo"
                      className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                    />
                  </div>
                </div>

                {/* Tech stack tags */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MdCode size={16} />
                    <span>Tech Stack Tags</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTechTag}
                      onChange={(e) => setNewTechTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechTag();
                        }
                      }}
                      placeholder="e.g. Next.js (Press enter to add)"
                      className="flex-1 px-4 py-2 rounded-lg border border-inherit outline-none bg-inherit text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTechTag}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-subtleLight/15 hover:bg-subtleLight/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {projectForm.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-inherit">
                      {projectForm.tech.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-accentLight/10 text-accentLight dark:bg-accentDark/15 dark:text-accentDark font-medium"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(tag)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <MdClose size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tabbed bilingual translations */}
                <div className="border-t border-inherit pt-6 space-y-4">
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
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          English Title
                        </label>
                        <input
                          type="text"
                          required={activeLangTab === "en"}
                          value={projectForm.en.title}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              en: { ...projectForm.en, title: e.target.value },
                            })
                          }
                          placeholder="e.g. Cinemania - Movies Platform"
                          className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            English Category
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "en"}
                            value={projectForm.en.category}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                en: {
                                  ...projectForm.en,
                                  category: e.target.value,
                                },
                              })
                            }
                            placeholder="e.g. Movies Platform"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5">
                            English Description
                          </label>
                          <textarea
                            required={activeLangTab === "en"}
                            value={projectForm.en.description}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                en: {
                                  ...projectForm.en,
                                  description: e.target.value,
                                },
                              })
                            }
                            rows={4}
                            placeholder="Brief summaries of what the project does..."
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Arabic Translation Input panel */}
                  {activeLangTab === "ar" && (
                    <div className="space-y-4 animate-fadeIn" dir="rtl">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 text-right">
                          العنوان بالعربية
                        </label>
                        <input
                          type="text"
                          required={activeLangTab === "ar"}
                          value={projectForm.ar.title}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              ar: { ...projectForm.ar, title: e.target.value },
                            })
                          }
                          placeholder="مثال: سينيمانيا - منصة الأفلام"
                          className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            التصنيف بالعربية
                          </label>
                          <input
                            type="text"
                            required={activeLangTab === "ar"}
                            value={projectForm.ar.category}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                ar: {
                                  ...projectForm.ar,
                                  category: e.target.value,
                                },
                              })
                            }
                            placeholder="مثال: منصة أفلام"
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1.5 text-right">
                            الوصف بالعربية
                          </label>
                          <textarea
                            required={activeLangTab === "ar"}
                            value={projectForm.ar.description}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                ar: {
                                  ...projectForm.ar,
                                  description: e.target.value,
                                },
                              })
                            }
                            rows={4}
                            placeholder="ملخص قصير عن مميزات المشروع..."
                            className="w-full px-4 py-2.5 rounded-lg border border-inherit outline-none bg-inherit resize-none text-right"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
