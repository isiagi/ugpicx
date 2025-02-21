import Image from "next/image"
import { Download, Heart } from "lucide-react"

interface ImageCardProps {
  src: string
  alt: string
  photographer: string
  category: string
  height: number
}

export function ImageCard({ src, alt, photographer, category, height }: ImageCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg group">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={400}
        height={height}
        className="w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        style={{ height: `${height}px` }}
      />
      <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-2 py-1 text-sm rounded-br-lg">
        {category}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black to-transparent">
        <p className="text-white text-sm font-medium">{photographer}</p>
      </div>
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white p-2 rounded-full shadow-lg">
          <Heart className="w-4 h-4 text-primary" />
        </button>
        <button className="bg-white p-2 rounded-full shadow-lg">
          <Download className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  )
}

