// app/api/images/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Increment the download count
    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { downloads: { increment: 1 } },
    });

    // You could add additional logic here to:
    // 1. Generate download URLs
    // 2. Track user download history
    // 3. Handle payment processing for paid downloads
    // 4. Add watermarks or process images before download

    return NextResponse.json({
      success: true,
      image: updatedImage,
      message: "Download count incremented successfully",
    });
  } catch (error) {
    console.error("Download tracking error:", error);

    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
