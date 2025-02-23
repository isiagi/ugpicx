import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showCategories={false} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="mb-4">
            At UgandaUnsplash, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy outlines how we collect, use, and safeguard your data when
            you use our website.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Personal information provided during account creation (e.g., name,
              email address)
            </li>
            <li>
              Information related to uploaded images (e.g., image metadata,
              descriptions)
            </li>
            <li>Usage data and analytics to improve our services</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Communicate with you about your account and our services</li>
            <li>Analyze usage patterns to enhance user experience</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your
            personal information from unauthorized access, disclosure,
            alteration, and destruction.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal
            information. If you have any questions or concerns about our privacy
            practices, please contact us.
          </p>
          <p className="mt-8 text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
