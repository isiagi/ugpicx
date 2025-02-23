/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// interface ImageProps {
//   id: string;
//   src: string;
//   alt: string;
//   title: string;
// }

// interface UserImageGridProps {
//   images: ImageProps[];
// }

export function UserImageGrid({ userId }: { userId: string }) {
  const [images, setImages] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/images/${userId}`);
        const data = await response.json();
        console.log(data, "data");

        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(`/api/images/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setImages(images?.filter((image: any) => image.id !== id));
          toast({
            title: "Image deleted",
            description: "The image has been successfully deleted.",
          });
        } else {
          throw new Error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast({
          title: "Error",
          description: "Failed to delete the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images?.length > 0 &&
        images?.map((image: any) => (
          <div key={image.id} className="relative group">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
            <p className="mt-2 text-sm font-medium truncate">{image.title}</p>
          </div>
        ))}
    </div>
  );
}
