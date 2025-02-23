import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="font-bold text-lg">
              UgandaUnsplash
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Discover the beauty of Uganda through images
            </p>
          </div>
          <nav className="flex gap-4">
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UgandaUnsplash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
