import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { ruleId: string } }
) {
  try {
    if (!params.ruleId) {
      return new NextResponse("rule id is required", { status: 400 });
    }

    const rule = await prismadb.rule.findUnique({
      where: {
        id: params.ruleId
      }
    });
  
    return NextResponse.json(rule);
  } catch (error) {
    console.log('[rule_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { ruleId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.ruleId) {
      return new NextResponse("rule id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const rule = await prismadb.rule.delete({
      where: {
        id: params.ruleId
      },
    });
  
    return NextResponse.json(rule);
  } catch (error) {
    console.log('[rule_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { ruleId: string, storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // console.log("Request body:", body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.ruleId) {
      return new NextResponse("Rule id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Retrieve the rule to check if it exists
    const existingRule = await prismadb.rule.findUnique({
      where: {
        id: params.ruleId
      }
    });

    if (!existingRule) {
      return new NextResponse("Rule not found", { status: 404 });
    }

    // Handle deletion based on ID 
    const updatedKondisi = body.kondisi.filter((item: { id: string }) => item.id !== body.deletedItemId);
    const updatedHasil = body.hasil.filter((item: { id: string }) => item.id !== body.deletedItemId);

    // Perform the update without converting arrays to strings
    const rule = await prismadb.rule.update({
      where: {
        id: params.ruleId
      },
      data: {
        kondisi: updatedKondisi,
        hasil: updatedHasil,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.log('[rule_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


