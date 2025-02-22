/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ImageDetailPage({ params }: { params: any }) {
  const image = await prisma.image.findUnique({
    where: { id: params.id },
  });

  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video mb-8">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{image.title}</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={image.src} download={`${image.title}.jpg`}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Photographer</h2>
              <p>{image.photographer}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <p>{image.category}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p>{image.alt}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
