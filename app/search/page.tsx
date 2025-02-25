/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "@/components/header";
import { ImageGrid } from "@/components/image-grid";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for &quot;{query}&quot;
        </h1>
        <Suspense fallback={<p>loading...</p>}>
          <ImageGrid category={query} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
