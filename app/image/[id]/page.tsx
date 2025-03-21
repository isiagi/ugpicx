import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Heart, Mail, Globe, Instagram, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentButton } from "@/components/payment-button";
import currencyFormater from "@/lib/currencyFormater";
import { DownloadButton } from "@/components/DownloadButton";
import { DisableImageRightClick } from "@/components/DisableImageRightClick";

export default async function ImageDetailPage({
  params,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}) {
  const image = await prisma.image.findUnique({
    where: { id: params.id },
  });

  if (!image) {
    return <div>Image not found</div>;
  }
  //   try {
  //     const encodedUrl = encodeURIComponent(image.src);
  //     const response = await fetch("/api/image-proxy?url=" + encodedUrl);
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${image.alt}.jpg`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     const responses = await fetch("/api/images/download", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ imageId: image.id }),
  //     });

  //     if (!responses.ok) {
  //       throw new Error("Failed to track download");
  //     }
  //     alert("Download successful!");
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <DisableImageRightClick />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-[400px] md:h-[700px] mb-8">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              priority
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-green-700">
              {image.title.toUpperCase()}
            </h1>
            <div className="flex flex-wrap gap-2 space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              {!image.price && (
                <DownloadButton
                  imageId={image.id}
                  imageSrc={image.src}
                  imageTitle={image.title}
                />
              )}
              {image.price && (
                <PaymentButton
                  imageId={image.id}
                  price={image.price}
                  imageSrc={image.src}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-slate-900">
                Photographer
              </h2>
              <p className="text-muted-foreground">{image.photographer}</p>
              <div className="mt-2 flex space-x-2">
                {image.email && (
                  <a
                    href={`mailto:${image.email}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Mail className="h-5 w-5 text-green-500" />
                  </a>
                )}
                {image.website && (
                  <a
                    href={image.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark"
                  >
                    <Globe className="h-5 w-5 text-green-500" />
                  </a>
                )}
                {image.instagram && (
                  <a
                    href={`https://instagram.com/${image.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark"
                  >
                    <Instagram className="h-5 w-5 text-green-500" />
                  </a>
                )}
                {image.twitter && (
                  <a
                    href={`https://twitter.com/${image.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark"
                  >
                    <Twitter className="h-5 w-5 text-green-500" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <p>{image.category}</p>
              {image.price && (
                <>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Price</h2>
                  <p>{currencyFormater.format(image.price)}</p>
                </>
              )}
              {!image.price && (
                <>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Downloads</h2>
                  <p>{image.downloads || 0}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p>{image.description || "No description provided"}</p>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
