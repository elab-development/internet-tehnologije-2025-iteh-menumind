import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export const CloudinarySignResponse = z.object({
  timestamp: z.number().describe("Unix timestamp used for signing"),
  signature: z.string().describe("Cloudinary API signature"),
  cloudName: z.string().describe("Cloudinary cloud name"),
  apiKey: z.string().describe("Cloudinary API key"),
  folder: z.string().describe("Target upload folder"),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Sign Cloudinary upload request
 * @description Returns a short-lived Cloudinary signature for authenticated restaurant admins
 * @operationId signCloudinaryUpload
 * @response 200:CloudinarySignResponse
 * @responseDescription Signed upload parameters
 * @responseSet none
 * @add 401,500
 * @auth apiKey
 * @tag Cloudinary
 * @openapi
 */
export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session?.user?.restaurantId ||
    session.user.role !== "RESTAURANT_ADMIN"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `restaurants/${session.user.restaurantId}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  });
}
