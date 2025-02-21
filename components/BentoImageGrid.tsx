/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart } from "lucide-react";

interface Image {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
  height?: number;
  width?: number;
}

type ImageSize = "small" | "medium" | "large" | "vertical" | "horizontal";

export function UnsplashGrid({ category }: { category?: string }) {
  const [images, setImages] = useState<(Image & { size: ImageSize })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const url = new URL("/api/images", window.location.origin);
        if (category) {
          url.searchParams.append("category", category);
        }
        const response = await fetch(url.toString());
        const data: Image[] = await response.json();

        const imagesWithSizes = assignSizesWithPattern(data);
        setImages(imagesWithSizes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [category]);

  const assignSizesWithPattern = (
    images: Image[]
  ): (Image & { size: ImageSize })[] => {
    const pattern: ImageSize[] = [
      "large", // 2x2
      "small", // 1x1
      "small", // 1x1
      "vertical", // 1x2
      "horizontal", // 2x1
      "small", // 1x1
      "medium", // 2x1
      "vertical", // 1x2
    ];

    return images.map((image, index) => ({
      ...image,
      size: pattern[index % pattern.length],
    }));
  };

  const handleDownload = async (src: string, alt: string) => {
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

  // Sample images for demonstration
  const sampleImages: (Image & { size: ImageSize })[] = [
    {
      id: "1",
      src: "/api/placeholder/800/600",
      alt: "Nature landscape",
      photographer: "John Doe",
      category: "Nature",
      size: "large",
      width: 800,
      height: 600,
    },
    {
      id: "2",
      src: "/api/placeholder/400/300",
      alt: "Urban scene",
      photographer: "Jane Smith",
      category: "Urban",
      size: "small",
      width: 400,
      height: 300,
    },
    {
      id: "3",
      src: "/api/placeholder/400/500",
      alt: "Portrait",
      photographer: "Mike Brown",
      category: "People",
      size: "vertical",
      width: 400,
      height: 500,
    },
  ];

  console.log(images, "images");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[2400px] mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images?.map((image) => (
          <div
            key={image.id}
            className="relative group"
            style={{
              paddingBottom:
                image.height && image.width
                  ? `${(image.height / image.width) * 100}%`
                  : "75%",
            }}
          >
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium">
                  {image.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.photographer}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                  onClick={() => handleDownload(image.src, image.alt)}
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnsplashGrid;
