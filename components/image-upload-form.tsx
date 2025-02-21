"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface ImagePreview {
  file: File;
  preview: string;
}

export function ImageUploadForm() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsUploading(true);
    try {
      for (const image of images) {
        // Get presigned URL
        const presignedResponse = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: image.file.name,
            contentType: image.file.type,
          }),
        });

        if (!presignedResponse.ok) {
          const errorData = await presignedResponse.json();
          throw new Error(
            `Failed to get presigned URL: ${
              errorData.error || presignedResponse.statusText
            }`
          );
        }

        const { signedUrl, key } = await presignedResponse.json();

        // Upload to R2
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: image.file,
          headers: { "Content-Type": image.file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload to R2: ${uploadResponse.statusText}`
          );
        }

        // Create database record
        const dbResponse = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            category,
            photographer: user.fullName || "Unknown",
            key,
          }),
        });

        if (!dbResponse.ok) {
          throw new Error(
            `Failed to create database record: ${dbResponse.statusText}`
          );
        }
      }

      // Reset form
      setImages([]);
      setTitle("");
      setCategory("");
      setOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      // You might want to add error handling UI here
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Post Image</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="wildlife">Wildlife</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="people">People</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={images.length === 0 || !title || !category || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
