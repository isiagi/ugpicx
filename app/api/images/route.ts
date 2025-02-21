import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("query")

  let images
  if (category) {
    images = await prisma.image.findMany({
      where: { category: { equals: category, mode: "insensitive" } },
    })
  } else if (query) {
    images = await prisma.image.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { alt: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
    })
  } else {
    images = await prisma.image.findMany()
  }

  return NextResponse.json(images)
}

