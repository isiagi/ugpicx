import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  // allow cors
  // request.headers.set("Access-Control-Allow-Origin", "*");
  // request.headers.set("Access-Control-Allow-Methods", "GET");
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const query = searchParams.get("query");
  const id = searchParams.get("id");

  let images;
  if (category) {
    images = await prisma.image.findMany({
      where: { category: { equals: category, mode: "insensitive" } },
    });
  } else if (search) {
    images = await prisma.image.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { alt: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      },
    });
  } else if (id) {
    images = await prisma.image.findUnique({ where: { id } });
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

  return NextResponse.json(images, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  });
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
      price,
    } = await request.json();

    console.log(price, "price");

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
        price: price ? Number.parseFloat(price) : null,
        userId,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.log("Error creating image record:", error);
    return NextResponse.json(
      { error: "Failed to create image record" },
      { status: 500 }
    );
  }
}
