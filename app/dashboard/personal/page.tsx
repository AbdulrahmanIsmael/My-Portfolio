"use client";

import { useEffect, useState } from "react";
import { MdSave, MdLanguage } from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

interface PersonalDataFields {
  name: string;
  profession: string;
  bio: string;
  location: string;
  resumeMessage: string;
}

interface PersonalData {
  en: PersonalDataFields;
  ar: PersonalDataFields;
}

export default function PersonalDetailsManager() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [personalInfo, setPersonalInfo] = useState<PersonalData>({
    en: { name: "", profession: "", bio: "", location: "", resumeMessage: "" },
    ar: { name: "", profession: "", bio: "", location: "", resumeMessage: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");

  useEffect(() => {
    async function fetchPersonal() {
      try {
        const res = await fetch("/api/dashboard/personal");
        if (res.ok) {
          const data = await res.json();
          setPersonalInfo(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPersonal();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/dashboard/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(personalInfo),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Personal details updated successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to update personal details.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "A network error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Personal Details
          </h1>
          <p
            className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}
          >
            Update key biographical descriptions, resume messaging, and contact
            locations.
          </p>
        </div>

        <button
          form="personal-form"
          type="submit"
          disabled={saving || loading}
          className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white shadow-md transition-all ${
            lightMode
              ? "bg-accentDark hover:bg-accentHoverDark shadow-accentDark/10"
              : "bg-accentLight hover:bg-accentHoverLight shadow-accentLight/10"
          } disabled:opacity-50`}
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
        <div
          className={`p-8 rounded-2xl border h-96 bg-subtleLight/10 animate-pulse`}
        />
      ) : (
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            lightMode
              ? "bg-white border-subtleDark/25 shadow-lg shadow-subtleDark/5"
              : "bg-black/10 border-subtleLight/10 shadow-lg shadow-black/10"
          }`}
        >
          {/* Tabs header */}
          <div className="flex justify-between items-center mb-6 border-b border-inherit pb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MdLanguage size={20} />
              <span>Biographical Fields</span>
            </h3>

            {/* Language Switcher Tabs */}
            <div className="flex border border-inherit rounded-lg overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === "en"
                    ? "bg-accentLight text-white"
                    : "hover:bg-primaryLight/5"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ar")}
                className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  activeTab === "ar"
                    ? "bg-accentLight text-white"
                    : "hover:bg-primaryLight/5"
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          <form id="personal-form" onSubmit={handleSave} className="space-y-6">
            {activeTab === "en" ? (
              <div className="space-y-4 animate-fadeIn" dir="ltr">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Full Name (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.en.name}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          en: { ...personalInfo.en, name: e.target.value },
                        })
                      }
                      placeholder="e.g. Abdulrahman Ismael"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Profession / Job Title (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.en.profession}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          en: {
                            ...personalInfo.en,
                            profession: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Frontend Engineer"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Location / Region (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.en.location}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          en: { ...personalInfo.en, location: e.target.value },
                        })
                      }
                      placeholder="e.g. Faisal, Giza, Egypt"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                      Resume Download Description (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.en.resumeMessage}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          en: {
                            ...personalInfo.en,
                            resumeMessage: e.target.value,
                          },
                        })
                      }
                      placeholder="Please download my updated resume"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Professional Summary / Bio (EN)
                  </label>
                  <textarea
                    required
                    value={personalInfo.en.bio}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        en: { ...personalInfo.en, bio: e.target.value },
                      })
                    }
                    rows={6}
                    placeholder="Tell visitors about your professional achievements, stack, and philosophy..."
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none resize-none ${
                      lightMode
                        ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                        : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn" dir="rtl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-right">
                      الاسم الكامل (AR)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.ar.name}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          ar: { ...personalInfo.ar, name: e.target.value },
                        })
                      }
                      placeholder="مثال: عبدالرحمن إسماعيل"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none text-right ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-right">
                      المسمى الوظيفي (AR)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.ar.profession}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          ar: {
                            ...personalInfo.ar,
                            profession: e.target.value,
                          },
                        })
                      }
                      placeholder="مثال: مهندس واجهة أمامية"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none text-right ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-right">
                      الموقع الجغرافي (AR)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.ar.location}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          ar: { ...personalInfo.ar, location: e.target.value },
                        })
                      }
                      placeholder="مثال: فيصل، الجيزة، مصر"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none text-right ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-right">
                      رسالة تحميل السيرة الذاتية (AR)
                    </label>
                    <input
                      type="text"
                      required
                      value={personalInfo.ar.resumeMessage}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          ar: {
                            ...personalInfo.ar,
                            resumeMessage: e.target.value,
                          },
                        })
                      }
                      placeholder="مثال: من فضلك حمل أحدث نسخة من سيرتي الذاتية"
                      className={`w-full px-4 py-2.5 rounded-lg border outline-none text-right ${
                        lightMode
                          ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                          : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-right">
                    الوصف الشخصي والنبذة المهنية (AR)
                  </label>
                  <textarea
                    required
                    value={personalInfo.ar.bio}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        ar: { ...personalInfo.ar, bio: e.target.value },
                      })
                    }
                    rows={6}
                    placeholder="اكتب نبذة مهنية تلخص فيها خبراتك وأعمالك..."
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none resize-none text-right ${
                      lightMode
                        ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                        : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                    }`}
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
