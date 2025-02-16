import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 購入履歴検索API
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();

  if (!userId) return NextResponse.json("User ID is required");

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
    });

    return NextResponse.json(purchases);
  } catch (err) {
    return NextResponse.json(err);
  }
}
