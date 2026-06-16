"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MdUpload,
  MdCheckCircle,
  MdError,
  MdImage,
  MdPictureAsPdf,
  MdClose,
  MdFilePresent,
} from "react-icons/md";
import useAppStore from "@/stores/store";
import { I_appStore } from "@/stores/types/appStore-types";

interface UploadStatus {
  type: "idle" | "uploading" | "success" | "error";
  message: string;
}

interface FilePreview {
  file: File | null;
  preview: string;
}

export default function FilesManager() {
  const { lightMode } = useAppStore((state) => state as I_appStore);

  const [cvFile, setCvFile] = useState<FilePreview>({ file: null, preview: "" });
  const [avatarFile, setAvatarFile] = useState<FilePreview>({ file: null, preview: "" });
  const [cvStatus, setCvStatus] = useState<UploadStatus>({ type: "idle", message: "" });
  const [avatarStatus, setAvatarStatus] = useState<UploadStatus>({ type: "idle", message: "" });

  const cvInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [cvDragging, setCvDragging] = useState(false);
  const [avatarDragging, setAvatarDragging] = useState(false);

  /* ─── CV handlers ──────────────────────────────────────────── */
  const handleCvSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      setCvStatus({ type: "error", message: "Only PDF files are accepted for the CV." });
      return;
    }
    setCvFile({ file, preview: file.name });
    setCvStatus({ type: "idle", message: "" });
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCvDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCvSelect(file);
  };

  const uploadCv = async () => {
    if (!cvFile.file) return;
    setCvStatus({ type: "uploading", message: "Uploading CV..." });
    try {
      const formData = new FormData();
      formData.append("cv", cvFile.file);
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
      if (res.ok) {
        setCvStatus({ type: "success", message: "CV uploaded and replaced successfully!" });
      } else {
        const data = await res.json();
        setCvStatus({ type: "error", message: data.error || "Upload failed. Please try again." });
      }
    } catch {
      setCvStatus({ type: "error", message: "A network error occurred. Please try again." });
    }
  };

  /* ─── Avatar handlers ──────────────────────────────────────── */
  const handleAvatarSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarStatus({ type: "error", message: "Only image files are accepted for the avatar." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarFile({ file, preview: e.target?.result as string });
    };
    reader.readAsDataURL(file);
    setAvatarStatus({ type: "idle", message: "" });
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAvatarDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarSelect(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile.file) return;
    setAvatarStatus({ type: "uploading", message: "Uploading avatar..." });
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile.file);
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
      if (res.ok) {
        setAvatarStatus({ type: "success", message: "Profile image uploaded successfully!" });
      } else {
        const data = await res.json();
        setAvatarStatus({ type: "error", message: data.error || "Upload failed. Please try again." });
      }
    } catch {
      setAvatarStatus({ type: "error", message: "A network error occurred. Please try again." });
    }
  };

  /* ─── Helpers ──────────────────────────────────────────────── */
  const cardClass = `rounded-2xl border transition-all duration-300 ${
    lightMode
      ? "bg-white border-subtleDark/20 shadow-lg shadow-subtleDark/5"
      : "bg-black/10 border-subtleLight/10 shadow-lg shadow-black/10"
  }`;

  const StatusBadge = ({ status }: { status: UploadStatus }) => {
    if (status.type === "idle" || !status.message) return null;
    const cfg = {
      uploading: { color: "bg-blue-500/15 border-blue-500/25 text-blue-500", icon: null },
      success: { color: "bg-green-500/15 border-green-500/25 text-green-500", icon: <MdCheckCircle size={18} /> },
      error: { color: "bg-red-500/15 border-red-500/25 text-red-500", icon: <MdError size={18} /> },
    }[status.type];
    return (
      <div className={`flex items-center gap-2 p-3.5 rounded-xl border text-sm ${cfg.color}`}>
        {status.type === "uploading" ? (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
        ) : cfg.icon}
        <span>{status.message}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Files & CV Manager</h1>
        <p className={`text-sm ${lightMode ? "text-textDark/60" : "text-textLight/60"}`}>
          Replace your public CV (PDF) and profile image cutout from here. Files are saved to{" "}
          <code className="text-xs bg-subtleLight/15 px-1.5 py-0.5 rounded font-mono">public/</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── CV Upload Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${cardClass} p-6 space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-500">
              <MdPictureAsPdf size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Resume / CV</h2>
              <p className={`text-xs ${lightMode ? "text-textDark/50" : "text-textLight/50"}`}>
                Replaces <code className="font-mono bg-subtleLight/10 px-1 rounded">public/files/Abdulrahman Ismael CV.pdf</code>
              </p>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setCvDragging(true); }}
            onDragLeave={() => setCvDragging(false)}
            onDrop={handleCvDrop}
            onClick={() => cvInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              cvDragging
                ? "border-red-400 bg-red-500/10"
                : lightMode
                ? "border-subtleDark/30 hover:border-red-400/60 hover:bg-red-500/5"
                : "border-subtleLight/20 hover:border-red-400/60 hover:bg-red-500/5"
            }`}
          >
            <input
              ref={cvInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCvSelect(f);
              }}
            />
            {cvFile.file ? (
              <>
                <MdFilePresent size={40} className="text-red-400" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{cvFile.file.name}</p>
                  <p className={`text-xs ${lightMode ? "text-textDark/50" : "text-textLight/50"}`}>
                    {(cvFile.file.size / 1024).toFixed(1)} KB — Click to change
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCvFile({ file: null, preview: "" });
                    setCvStatus({ type: "idle", message: "" });
                  }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                >
                  <MdClose size={18} />
                </button>
              </>
            ) : (
              <>
                <MdUpload size={36} className={lightMode ? "text-textDark/30" : "text-textLight/30"} />
                <div className="text-center">
                  <p className={`font-semibold text-sm ${lightMode ? "text-textDark/70" : "text-textLight/70"}`}>
                    Drag & drop or click to select
                  </p>
                  <p className={`text-xs ${lightMode ? "text-textDark/40" : "text-textLight/40"}`}>
                    PDF only — max 10 MB
                  </p>
                </div>
              </>
            )}
          </div>

          <StatusBadge status={cvStatus} />

          <button
            onClick={uploadCv}
            disabled={!cvFile.file || cvStatus.type === "uploading"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              lightMode
                ? "bg-accentDark hover:bg-accentHoverDark shadow-md shadow-accentDark/10"
                : "bg-accentLight hover:bg-accentHoverLight shadow-md shadow-accentLight/10"
            }`}
          >
            {cvStatus.type === "uploading" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MdUpload size={18} />
            )}
            <span>Upload & Replace CV</span>
          </button>
        </motion.div>

        {/* ── Avatar Upload Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`${cardClass} p-6 space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-500">
              <MdImage size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Profile Image</h2>
              <p className={`text-xs ${lightMode ? "text-textDark/50" : "text-textLight/50"}`}>
                Replaces <code className="font-mono bg-subtleLight/10 px-1 rounded">public/assets/images/personal-image-cutout.png</code>
              </p>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setAvatarDragging(true); }}
            onDragLeave={() => setAvatarDragging(false)}
            onDrop={handleAvatarDrop}
            onClick={() => avatarInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${
              avatarDragging
                ? "border-blue-400 bg-blue-500/10"
                : lightMode
                ? "border-subtleDark/30 hover:border-blue-400/60"
                : "border-subtleLight/20 hover:border-blue-400/60"
            }`}
            style={{ minHeight: "200px" }}
          >
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarSelect(f);
              }}
            />
            {avatarFile.preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarFile.preview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "260px" }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                  <MdUpload size={28} />
                  <span className="text-sm font-semibold">Click to change</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarFile({ file: null, preview: "" });
                    setAvatarStatus({ type: "idle", message: "" });
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500/80 transition-colors"
                >
                  <MdClose size={16} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <MdImage size={40} className={lightMode ? "text-textDark/30" : "text-textLight/30"} />
                <div className="text-center">
                  <p className={`font-semibold text-sm ${lightMode ? "text-textDark/70" : "text-textLight/70"}`}>
                    Drag & drop or click to select
                  </p>
                  <p className={`text-xs ${lightMode ? "text-textDark/40" : "text-textLight/40"}`}>
                    PNG, JPG, WebP — recommended: cutout with transparent background
                  </p>
                </div>
              </div>
            )}
          </div>

          <StatusBadge status={avatarStatus} />

          <button
            onClick={uploadAvatar}
            disabled={!avatarFile.file || avatarStatus.type === "uploading"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              lightMode
                ? "bg-accentDark hover:bg-accentHoverDark shadow-md shadow-accentDark/10"
                : "bg-accentLight hover:bg-accentHoverLight shadow-md shadow-accentLight/10"
            }`}
          >
            {avatarStatus.type === "uploading" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MdUpload size={18} />
            )}
            <span>Upload & Replace Image</span>
          </button>
        </motion.div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className={`p-5 rounded-2xl border ${
          lightMode
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-blue-500/10 border-blue-500/15"
        }`}
      >
        <p className="text-sm font-semibold text-blue-500 mb-2">💡 How file replacement works</p>
        <ul className={`text-xs space-y-1 list-disc ml-4 ${lightMode ? "text-textDark/70" : "text-textLight/70"}`}>
          <li>Files are saved to the <code className="font-mono bg-subtleLight/10 px-1 rounded">public/</code> directory and override existing files with the same name.</li>
          <li>CV is always saved as <code className="font-mono bg-subtleLight/10 px-1 rounded">Abdulrahman Ismael CV.pdf</code> — no URL changes needed.</li>
          <li>Profile image is always saved as <code className="font-mono bg-subtleLight/10 px-1 rounded">personal-image-cutout.png</code> — the portfolio will use it on the next page load.</li>
          <li>Recommended profile image format: PNG with a transparent background (cutout style).</li>
        </ul>
      </motion.div>
    </div>
  );
}
