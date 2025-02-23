import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

const UserProfilePage = () => {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <Link href="/" className="absolute top-4 left-4 text-sm hover:underline">
        Go Back
      </Link>
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
