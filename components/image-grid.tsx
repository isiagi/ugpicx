/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Heart, ImageIcon } from "lucide-react";
// import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRouter } from "next/navigation";
import { PaymentButton } from "./payment-button";
import { useQuery } from "@tanstack/react-query";

interface Image {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
  price: number;
}

const buildOptimizedUrl = (src: string, width = 800, quality = 75) => {
  // 1. Your custom Cloudflare domain (must be proxied via Cloudflare DNS)
  const CLOUDFLARE_DOMAIN = "https://www.ugpicxdb.work";

  // 2. Extract the relative path after domain (e.g. /user_xyz/image.jpg)
  const relativePath = src.replace(CLOUDFLARE_DOMAIN, "");

  // 3. Construct the optimized URL with Cloudflare transform params
  return `${CLOUDFLARE_DOMAIN}/cdn-cgi/image/width=${width},quality=${quality},format=auto${relativePath}`;
};

const ImageCard = ({ image }: { image: Image }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  // const handleDownload = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   // Implement download logic here
  //   const link = document.createElement("a");
  //   link.href = image.src;
  //   link.download = `${image.alt}.jpg`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloading(true);
      const encodedUrl = encodeURIComponent(image.src);
      const response = await fetch("/api/image-proxy?url=" + encodedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${image.alt}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const responses = await fetch("/api/images/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: image.id }),
      });

      if (!responses.ok) {
        throw new Error("Failed to track download");
      }
      alert("Download successful!");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleImageClick = () => {
    router.push(`/image/${image.id}`);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement heart/like functionality here
    console.log("Heart clicked for image:", image.id);
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
      onClick={handleImageClick}
    >
      <Image
        src={buildOptimizedUrl(image.src) || "/placeholder.svg"}
        alt={image.alt}
        width={500}
        height={500}
        className={`object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        // onContextMenu={(e) => e.preventDefault()}
        onError={() => setImageError(true)}
        unoptimized
        priority
      />

      {/* <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        onClick={handleImageClick}
      /> */}

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
          <div className="absolute top-4 right-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              onClick={handleHeartClick}
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            {image?.price ? (
              <PaymentButton
                price={image.price}
                imageId={image}
                imageSrc={image.src}
              />
            ) : downloading ? (
              <p className="text-green-500">streaming...</p>
            ) : (
              <button
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 text-gray-700" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
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

export function ImageGrid({
  category,
  refreshCounter,
}: {
  category?: string;
  refreshCounter?: number;
}) {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["images", category, refreshCounter],
    queryFn: async () => {
      const url = new URL("/api/images", window.location.origin);
      if (category && category !== "All") {
        url.searchParams.append("category", category);
      }
      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        console.log(error, "erret");
      }
    },
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!isLoading && images.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry gutter="1rem">
        {images.map((image: any) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default ImageGrid;
