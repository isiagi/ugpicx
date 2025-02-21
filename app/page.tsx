import UnsplashGrid from "@/components/BentoImageGrid";
import { Header } from "@/components/header";
// import { ImageGrid } from "@/components/image-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Discover Ugandan Beauty</h1>
        <div className="max-w-[2000px] mx-auto">
          <UnsplashGrid />
        </div>
      </main>
    </div>
  );
}
