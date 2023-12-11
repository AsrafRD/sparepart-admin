import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const body = await req.json();

    // console.log("data rules yang dikirim ke server", body);

    // Convert kondisi and hasil to an array of strings
    const kondisi = body.kondisi.map((item: any) => item.name).join(", ");
    const hasil = body.hasil.map((item: any) => item.name).join(", ");

    const rule = await prismadb.rule.create({
      data: {
        kondisi,
        hasil,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.log("[RULES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const url = req.url;

    if (!url) {
      return new NextResponse("URL is undefined", { status: 500 });
    }

    const { searchParams } = new URL(url);
    const searchQuery = searchParams?.get("q") || "";

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const rules = await prismadb.rule.findMany({
      where: {
        hasil: {
          contains: searchQuery, // Use the search query to filter rule names
        },
        storeId: params.storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.log("[ruleS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
