/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
  size: "small" | "medium" | "large" | "vertical" | "horizontal";
}

export function ImageCard({
  id,
  src,
  alt,
  photographer,
  category,
  size,
}: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${alt}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      className={cn("relative group rounded-xl overflow-hidden", {
        "col-span-2 row-span-2": size === "large",
        "col-span-2 row-span-1": size === "horizontal",
        "row-span-2": size === "vertical",
        "col-span-1 row-span-1": size === "small",
        "col-span-2 row-span-1": size === "medium",
      })}
      style={{
        height:
          size === "small"
            ? "200px"
            : size === "medium" || size === "horizontal"
            ? "300px"
            : size === "vertical" || size === "large"
            ? "500px"
            : "auto",
      }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
        <span className="text-white text-sm font-medium">{category}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {photographer}
        </p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
