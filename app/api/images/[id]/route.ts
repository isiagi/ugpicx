/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// get by userid
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note the Promise type
) {
  const { id } = await params; // Await the params object

  console.log(id);

  //   userId: string

  try {
    const image = await prisma.image.findMany({
      where: { userId: id },
    });
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    console.log("Failed to fetch image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const { id } = params;

  try {
    await prisma.image.delete({ where: { id } });
    return NextResponse.json({ message: "Image deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
