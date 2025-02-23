// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Image {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
  size?: "small" | "medium" | "large" | "vertical" | "horizontal";
}

// Function to determine size based on index pattern
const getSizeFromIndex = (index: number): Image["size"] => {
  // Create a repeating pattern for the grid
  const pattern = [
    "large", // 1st image: large (2x2)
    "vertical", // 2nd image: vertical (1x2)
    "small", // 3rd image: small (1x1)
    "horizontal", // 4th image: horizontal (2x1)
    "small", // 5th image: small (1x1)
    "medium", // 6th image: medium (2x1)
    "vertical", // 7th image: vertical (1x2)
    "small", // 8th image: small (1x1)
  ];
  return pattern[index % pattern.length];
};

const ImageCard = ({ image, index }: { image: Image; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use index to determine size
  const size = getSizeFromIndex(index);

  return (
    <Link
      href={`/image/${image.id}`}
      className={cn("relative group rounded-xl overflow-hidden bg-gray-100", {
        "col-span-2 row-span-2": size === "large",
        "col-span-2 row-span-1": size === "horizontal" || size === "medium",
        "row-span-2": size === "vertical",
        "col-span-1 row-span-1": size === "small",
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
        src={image.src}
        alt={image.alt}
        fill
        className={cn(
          "object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setImageError(true)}
        unoptimized
      />

      {/* Loading state */}
      {isLoading && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      )}

      {/* Overlay content */}
      {!isLoading && !imageError && (
        <>
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {image.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {image.photographer}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Download className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </>
      )}
    </Link>
  );
};

const ImageSkeleton = ({ size }: { size: Image["size"] }) => {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-gray-200 animate-pulse",
        {
          "col-span-2 row-span-2": size === "large",
          "col-span-2 row-span-1": size === "horizontal" || size === "medium",
          "row-span-2": size === "vertical",
          "col-span-1 row-span-1": size === "small",
        }
      )}
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
    />
  );
};

export function ImageGrid({ category }: { category?: string }) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/images", window.location.origin);
        if (category) {
          url.searchParams.append("category", category);
        }
        const response = await fetch(url.toString());
        const data = await response.json();
        console.log(data);

        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  // Get skeleton sizes using the same pattern
  const skeletonSizes = Array(8)
    .fill(null)
    .map((_, index) => getSizeFromIndex(index));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {loading
        ? skeletonSizes.map((size, index) => (
            <ImageSkeleton key={`skeleton-${index}`} size={size} />
          ))
        : images.map((image, index) => (
            <ImageCard key={image.id} image={image} index={index} />
          ))}
    </div>
  );
}

export default ImageGrid;
