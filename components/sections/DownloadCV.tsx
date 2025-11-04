"use client";

import {} from "react-icons/md";

import { MdOutlineDownload, MdOutlineDownloadDone } from "react-icons/md";

import Button from "@/components/ui/Button";
import { I_appStore } from "@/stores/types/appStore-types";
import React from "react";
import axios from "axios";
import useAppStore from "@/stores/store";
import { useState } from "react";
import { useTranslations } from "next-intl";

const DownloadCV = ({ className = "" }: { className?: string }) => {
  const { arabicLang } = useAppStore((state) => state as I_appStore);
  const [downloaded, isDownloaded] = useState(false);
  const downloadCVMessage = useTranslations(
    `Home.${arabicLang ? "ar" : "en"}.buttons`
  );

  const handleDownloadCV = async () => {
    const filename = "Abdulrahman Ismael CV.pdf";
    const encodedFilename = encodeURIComponent(filename);

    isDownloaded(true);
    setTimeout(() => {
      isDownloaded(false);
    }, 3000);

    try {
      const response = await axios.get(
        `/api/download?filename=${encodedFilename}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  return (
    <Button
      className={`flex items-center gap-2 ${className}`}
      clickHandler={handleDownloadCV}
    >
      {downloaded ? (
        <MdOutlineDownloadDone size={20} />
      ) : (
        <MdOutlineDownload size={20} />
      )}{" "}
      {downloadCVMessage("downloadCV")}
    </Button>
  );
};

export default DownloadCV;
