"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Download, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Image {
  id: string
  src: string
  alt: string
  photographer: string
  category: string
  size: "small" | "medium" | "large" | "vertical" | "horizontal"
}

export function ImageGrid({ category }: { category?: string }) {
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const url = new URL("/api/images", window.location.origin)
      if (category) {
        url.searchParams.append("category", category)
      }
      const response = await fetch(url.toString())
      const data = await response.json()
      setImages(data)
    }

    fetchImages()
  }, [category])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {images.map((image) => (
        <Link
          key={image.id}
          href={`/image/${image.id}`}
          className={cn("relative group rounded-xl overflow-hidden", {
            "col-span-2 row-span-2": image.size === "large",
            "col-span-2 row-span-1": image.size === "horizontal",
            "row-span-2": image.size === "vertical",
            "col-span-1 row-span-1": image.size === "small",
            "col-span-2 row-span-1": image.size === "medium",
          })}
          style={{
            height:
              image.size === "small"
                ? "200px"
                : image.size === "medium" || image.size === "horizontal"
                  ? "300px"
                  : image.size === "vertical" || image.size === "large"
                    ? "500px"
                    : "auto",
          }}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">{image.category}</span>
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
        </Link>
      ))}
    </div>
  )
}

