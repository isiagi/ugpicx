import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { UserImageGrid } from "@/components/user-image-grid";

export default async function MyImagesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  //   Fetch user images from API route

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">My Images</h1>
        <UserImageGrid userId={userId} />
      </main>
      <Footer />
    </div>
  );
}
