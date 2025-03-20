"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart, ImageIcon } from "lucide-react";
// import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRouter } from "next/navigation";
import { PaymentButton } from "./payment-button";

interface Image {
  id: string;
  src: string;
  alt: string;
  photographer: string;
  category: string;
  price: number;
}

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
        src={image.src || "/placeholder.svg"}
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

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!loading && images.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry gutter="1rem">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default ImageGrid;
