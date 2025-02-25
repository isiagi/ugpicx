"use client";

import type React from "react";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadForm } from "./image-upload-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import {
  Camera,
  Leaf,
  PawPrintIcon as Paw,
  Building,
  Users,
  Palette,
  BuildingIcon as Buildings,
  Cpu,
  Utensils,
  PaintbrushIcon as PaintBrush,
  Dumbbell,
  Plane,
  Shirt,
} from "lucide-react";
import Image from "next/image";
const categories = [
  { name: "All", icon: <Camera className="w-4 h-4 mr-2 text-green-500" /> },
  { name: "Nature", icon: <Leaf className="w-4 h-4 mr-2 text-green-500" /> },
  { name: "Wildlife", icon: <Paw className="w-4 h-4 mr-2 text-green-500" /> },
  {
    name: "Architecture",
    icon: <Building className="w-4 h-4 mr-2 text-green-500" />,
  },
  { name: "People", icon: <Users className="w-4 h-4 mr-2 text-green-500" /> },
  {
    name: "Culture",
    icon: <Palette className="w-4 h-4 mr-2 text-green-500 text-green-500" />,
  },
  {
    name: "Cities",
    icon: <Buildings className="w-4 h-4 mr-2 text-green-500 text-green-500" />,
  },
  { name: "Technology", icon: <Cpu className="w-4 h-4 mr-2 text-green-500" /> },
  { name: "Food", icon: <Utensils className="w-4 h-4 mr-2 text-green-500" /> },
  { name: "Art", icon: <PaintBrush className="w-4 h-4 mr-2 text-green-500" /> },
  {
    name: "Sports",
    icon: <Dumbbell className="w-4 h-4 mr-2 text-green-500 text-green-500" />,
  },
  { name: "Travel", icon: <Plane className="w-4 h-4 mr-2 text-green-500" /> },
  { name: "Fashion", icon: <Shirt className="w-4 h-4 mr-2 text-green-500" /> },
];

export function Header({ showCategories = true }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isSignedIn } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      if (direction === "left") {
        current.scrollLeft -= 200;
      } else {
        current.scrollLeft += 200;
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/ug.png"} alt="logo" width={120} height={150} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form
            onSubmit={handleSearch}
            className="w-full flex-1 md:w-auto md:flex-none"
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images"
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <ImageUploadForm />
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <UserButton afterSignOutUrl="/" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/my-images">My Images</Link>
                </DropdownMenuItem>
                {/* my account */}
                <DropdownMenuItem asChild>
                  <Link href="/user-profile">My Account</Link>
                </DropdownMenuItem>
                {/* logout */}
                <DropdownMenuItem asChild>
                  <SignOutButton>
                    <button className="w-full text-left">Logout</button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Login</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <SignInButton mode="modal">
                    <button className="w-full text-left">Sign In</button>
                  </SignInButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignUpButton mode="modal">
                    <button className="w-full text-left">Sign Up</button>
                  </SignUpButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {showCategories && (
        <div className="border-t relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <ScrollArea className="w-full whitespace-nowrap" ref={scrollRef}>
            <div className="flex h-12 items-center px-4 container">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/category/${category.name.toLowerCase()}`}
                  className="flex items-center px-4 py-2 text-yellow-700 text-sm font-medium transition-colors hover:text-yellow-500"
                >
                  {category.icon}
                  {category.name}
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
