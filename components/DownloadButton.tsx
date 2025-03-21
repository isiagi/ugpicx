/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ imageId, imageSrc, imageTitle }: any) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const encodedUrl = encodeURIComponent(imageSrc);
      const response = await fetch("/api/image-proxy?url=" + encodedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageTitle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const trackResponse = await fetch("/api/images/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (!trackResponse.ok) {
        throw new Error("Failed to track download");
      }

      setDownloadCount((prev) => prev + 1);
      alert("Download successful!");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download
        className={`h-4 w-4 ${
          isDownloading ? "text-gray-400" : "text-green-500"
        }`}
      />
    </Button>
  );
}
