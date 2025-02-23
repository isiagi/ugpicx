import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  let images;
  if (category) {
    images = await prisma.image.findMany({
      where: { category: { equals: category, mode: "insensitive" } },
    });
  } else if (query) {
    images = await prisma.image.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { alt: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  } else {
    images = await prisma.image.findMany();
  }

  return NextResponse.json(images);
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      category,
      photographer,
      key,
      email,
      website,
      instagram,
      twitter,
    } = await request.json();

    const image = await prisma.image.create({
      data: {
        title,
        email,
        website,
        instagram,
        twitter,
        alt: title,
        src: `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_DOMAIN}/${key}`,
        photographer,
        category,
        size: "medium",
        userId,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error creating image record:", error);
    return NextResponse.json(
      { error: "Failed to create image record" },
      { status: 500 }
    );
  }
}
