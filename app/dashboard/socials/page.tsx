"use client";

import { MdSave, MdShare } from "react-icons/md";
import { useEffect, useState } from "react";

import { I_appStore } from "@/stores/types/appStore-types";
import useAppStore from "@/stores/store";

interface SocialLinks {
  linkedin: string;
  gmail: string;
  github: string;
  gitlab: string;
  stackOverflow: string;
  behance: string;
}

export default function SocialLinksManager() {
  const { lightMode } = useAppStore((state) => state as I_appStore);
  const [socials, setSocials] = useState<SocialLinks>({
    linkedin: "",
    gmail: "",
    github: "",
    gitlab: "",
    stackOverflow: "",
    behance: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function fetchSocials() {
      try {
        const res = await fetch("/api/dashboard/socials");
        if (res.ok) {
          const data = await res.json();
          setSocials(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSocials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/dashboard/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(socials),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Social links updated successfully!",
        });
      } else {
        setStatus({ type: "error", message: "Failed to update social links." });
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

  const fields = [
    {
      key: "linkedin",
      label: "LinkedIn Profile URL",
      placeholder: "https://linkedin.com/in/username",
    },
    {
      key: "github",
      label: "GitHub Profile URL",
      placeholder: "https://github.com/username",
    },
    {
      key: "gmail",
      label: "Contact Email Address",
      placeholder: "your.email@gmail.com",
    },
    {
      key: "gitlab",
      label: "GitLab Profile URL",
      placeholder: "https://gitlab.com/username",
    },
    {
      key: "stackOverflow",
      label: "Stack Overflow Profile URL",
      placeholder: "https://stackoverflow.com/users/id/username",
    },
    {
      key: "behance",
      label: "Behance Portfolio URL",
      placeholder: "https://behance.net/username",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Social Links
          </h1>
          <p
            className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}
          >
            Configure URLs that connect icon buttons and links on the main site.
          </p>
        </div>

        <button
          form="socials-form"
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
          <div className="flex items-center gap-2 mb-6 border-b border-inherit pb-3">
            <MdShare
              size={22}
              className="text-accentLight dark:text-accentDark"
            />
            <h3 className="text-lg font-bold">Profiles Configuration</h3>
          </div>

          <form
            id="socials-form"
            onSubmit={handleSave}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  {f.label}
                </label>
                <input
                  type={f.key === "gmail" ? "email" : "text"}
                  required
                  value={socials[f.key as keyof SocialLinks] || ""}
                  onChange={(e) =>
                    setSocials({
                      ...socials,
                      [f.key]: e.target.value,
                    })
                  }
                  placeholder={f.placeholder}
                  className={`w-full px-4 py-2.5 rounded-lg border outline-none ${
                    lightMode
                      ? "bg-primaryDark border-subtleDark/20 focus:border-accentDark"
                      : "bg-primaryLight/50 border-subtleLight/20 focus:border-accentLight"
                  }`}
                />
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
}
