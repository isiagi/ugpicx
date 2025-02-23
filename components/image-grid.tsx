// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart, ImageIcon } from "lucide-react";
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
  const pattern = [
    "large",
    "vertical",
    "small",
    "horizontal",
    "small",
    "medium",
    "vertical",
    "small",
  ];
  return pattern[index % pattern.length];
};

const ImageCard = ({ image, index }: { image: Image; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

const EmptyState = ({ category }: { category?: string }) => {
  return (
    <div className="col-span-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No images found
      </h3>
      <p className="text-gray-500 max-w-md">
        {category
          ? `No images found in the "${category}" category. Try selecting a different category or check back later.`
          : "No images are available at the moment. Please check back later."}
      </p>
    </div>
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
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  const skeletonSizes = Array(8)
    .fill(null)
    .map((_, index) => getSizeFromIndex(index));

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
        {skeletonSizes.map((size, index) => (
          <ImageSkeleton key={`skeleton-${index}`} size={size} />
        ))}
      </div>
    );
  }

  if (!loading && images.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {images.map((image, index) => (
        <ImageCard key={image.id} image={image} index={index} />
      ))}
    </div>
  );
}

export default ImageGrid;
