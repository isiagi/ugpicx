"use client";

import { Header } from "@/components/header";
import { ImageGrid } from "@/components/image-grid";
import { useState } from "react";

export default function Home() {
  // State to track when images are uploaded
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to trigger a refresh of the ImageGrid
  const handleImageUpload = () => {
    setRefreshCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onImageUpload={handleImageUpload} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-slate-700">
          Discover Ugandan Beauty
        </h1>
        <div className="max-w-[2000px] mx-auto">
          <ImageGrid refreshCounter={refreshCounter} />
        </div>
      </main>
    </div>
  );
}
