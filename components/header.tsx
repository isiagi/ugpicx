"use client";

import type React from "react";

import { Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const categories = [
  "All",
  "Nature",
  "Wildlife",
  "Architecture",
  "People",
  "Culture",
  "Cities",
  "Technology",
  "Food",
  "Art",
  "Sports",
  "Travel",
  "Fashion",
];

export function Header({ showCategories = true }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">UgandaUnsplash</span>
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
          {isSignedIn && <ImageUploadForm />}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
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
        <div className="border-t">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex h-12 items-center px-4 container">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="flex items-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  {category}
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
