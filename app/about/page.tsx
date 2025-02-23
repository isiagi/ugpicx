import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About UgandaUnsplash</h1>
          <p className="mb-4">
            UgandaUnsplash is a platform dedicated to showcasing the beauty and
            diversity of Uganda through high-quality, freely usable images. Our
            mission is to provide a space for photographers to share their
            unique perspectives of Uganda and for users to access stunning
            visuals that capture the essence of this beautiful country.
          </p>
          <p className="mb-4">
            Whether you&apos;re a traveler planning your next adventure, a
            content creator looking for authentic Ugandan imagery, or simply
            someone who appreciates the beauty of East Africa, UgandaUnsplash is
            your go-to resource for captivating Ugandan photography.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p className="mb-4">We aim to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Promote Uganda&apos;s natural beauty, culture, and people through
              powerful imagery
            </li>
            <li>
              Support and showcase talented photographers from Uganda and beyond
            </li>
            <li>
              Provide a user-friendly platform for discovering and sharing
              high-quality images of Uganda
            </li>
            <li>
              Foster a community of photography enthusiasts and Uganda lovers
            </li>
          </ul>
          <p>
            Join us in celebrating the beauty of Uganda, one image at a time.
          </p>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
