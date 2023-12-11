import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // console.log("data keluhan yang dikirim dari pelanggan", body);
    const { storeId, selectedIndications } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const kondisiString = JSON.stringify(selectedIndications);

    // Logic for Forward Chaining
    const matchingRules = await prismadb.rule.findMany({
      where: {
        indications: {
          some: {
            id: {
              in: selectedIndications,
            },
          },
        },
        storeId,
      },
    });

    if (matchingRules.length === 0) {
      // Handle the case when no matching rules are found
      return NextResponse.json({ hasil: "Tidak ada hasil yang ditemukan" });
    }

    // Assuming the rule has a field 'hasil', concatenate results from all matching rules
    const hasil = matchingRules.map((rule) => rule.hasil).join(", ");
    
    return NextResponse.json({ hasil });
  } catch (error) {
    console.error("[CHECK_INDICATIONS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
