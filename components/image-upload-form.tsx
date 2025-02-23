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
import { X, AlertCircle } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";

import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImagePreview {
  file: File;
  preview: string;
}

export function ImageUploadForm() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { user, isSignedIn } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = [];

    for (const file of files) {
      // Check image size
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = () => {
          if (img.width * img.height >= 5000000) {
            // 5MP = 5,000,000 pixels
            newImages.push({
              file,
              preview: img.src,
            });
          } else {
            toast({
              title: "Image too small",
              description: `${file.name} is less than 5MP. Please upload larger images.`,
              variant: "destructive",
            });
          }
          resolve(null);
        };
      });
    }

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
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive",
      });
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
            email,
            website,
            instagram,
            twitter,
            userId: user.id,
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
      setEmail("");
      setWebsite("");
      setInstagram("");
      setTwitter("");
      setOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      // You might want to add error handling UI here
    } finally {
      setIsUploading(false);
    }
  };

  // if (!user) {
  //   return null;
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Post Image</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        {isSignedIn ? (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Guidelines</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 text-sm">
                  <li>Images should be original and owned by you</li>
                  <li>Minimum image size: 5 megapixels</li>
                  <li>Acceptable formats: JPG, PNG</li>
                  <li>Maximum file size: 10MB per image</li>
                </ul>
              </AlertDescription>
            </Alert>

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="instagram">Instagram (optional)</Label>
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
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

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="twitter">Twitter (optional)</Label>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                images.length === 0 || !title || !category || isUploading
              }
              className="mt-4"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        ) : (
          <div className="py-4 text-center">
            <p className="mb-4">Please sign in to upload images.</p>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
