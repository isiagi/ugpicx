/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    console.log(userId, "userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType } = body;

    // Validate required fields
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (
      !process.env.CLOUDFLARE_R2_ENDPOINT ||
      !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
      !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
      !process.env.CLOUDFLARE_R2_BUCKET_NAME
    ) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const key = `${userId}/${filename}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    try {
      const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60,
      });
      return NextResponse.json({ signedUrl, key });
    } catch (error: any) {
      console.error("Error generating signed URL:", {
        error,
        message: error.message,
        stack: error.stack,
        command: putObjectCommand,
      });
      return NextResponse.json(
        {
          error: "Failed to generate signed URL",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in upload handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
