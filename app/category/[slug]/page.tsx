/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from "@/components/header";
import { ImageGrid } from "@/components/image-grid";

export default function CategoryPage({ params }: any) {
  const category = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{category} Images</h1>
        <div className="max-w-[2000px] mx-auto">
          <ImageGrid category={category} />
        </div>
      </main>
    </div>
  );
}
