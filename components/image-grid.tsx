"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Image {
  id: string
  src: string
  alt: string
  photographer: string
  category: string
  size: "small" | "medium" | "large" | "vertical" | "horizontal"
}

// Updated sample data with balanced sizes
const sampleImages: Image[] = [
  {
    id: "1",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crop-STwbZ0Ypt5vRVKkmI9gyf2Djy8K5Tw.png",
    alt: "Orange supercar",
    photographer: "John Doe",
    category: "Cars",
    size: "horizontal",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=800&width=600",
    alt: "Vertical image",
    photographer: "Jane Smith",
    category: "Nature",
    size: "vertical",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Medium image 1",
    photographer: "Alice Johnson",
    category: "Wildlife",
    size: "medium",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=300&width=300",
    alt: "Small image 1",
    photographer: "Bob Wilson",
    category: "Culture",
    size: "small",
  },
  {
    id: "5",
    src: "/placeholder.svg?height=600&width=900",
    alt: "Large image",
    photographer: "Emma Davis",
    category: "Architecture",
    size: "large",
  },
  {
    id: "6",
    src: "/placeholder.svg?height=300&width=300",
    alt: "Small image 2",
    photographer: "Charlie Brown",
    category: "People",
    size: "small",
  },
  {
    id: "7",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Medium image 2",
    photographer: "Diana Prince",
    category: "Technology",
    size: "medium",
  },
  {
    id: "8",
    src: "/placeholder.svg?height=800&width=600",
    alt: "Vertical image 2",
    photographer: "Bruce Wayne",
    category: "City",
    size: "vertical",
  },
  {
    id: "9",
    src: "/placeholder.svg?height=400&width=600",
    alt: "Horizontal image 2",
    photographer: "Clark Kent",
    category: "Landscape",
    size: "horizontal",
  },
  {
    id: "10",
    src: "/placeholder.svg?height=300&width=300",
    alt: "Small image 3",
    photographer: "Lois Lane",
    category: "Food",
    size: "small",
  },
]

export function ImageGrid({ category }: { category?: string }) {
  const [images] = useState(
    category ? sampleImages.filter((img) => img.category.toLowerCase() === category.toLowerCase()) : sampleImages,
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {images.map((image) => (
        <div
          key={image.id}
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
          {/* Category Tag */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">{image.category}</span>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Photographer */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {image.photographer}
            </p>
          </div>
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Download className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

