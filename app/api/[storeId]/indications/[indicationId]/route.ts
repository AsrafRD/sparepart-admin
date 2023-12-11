import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { indicationId: string } }
) {
  try {
    if (!params.indicationId) {
      return new NextResponse("indication id is required", { status: 400 });
    }

    const indication = await prismadb.indication.findUnique({
      where: {
        id: params.indicationId
      }
    });
  
    return NextResponse.json(indication);
  } catch (error) {
    console.log('[indication_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { indicationId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.indicationId) {
      return new NextResponse("indication id is required", { status: 400 });
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

    const indication = await prismadb.indication.delete({
      where: {
        id: params.indicationId
      },
    });
  
    return NextResponse.json(indication);
  } catch (error) {
    console.log('[indication_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { indicationId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { kode, name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.indicationId) {
      return new NextResponse("indication id is required", { status: 400 });
    }

    if (!kode) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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

    const indication = await prismadb.indication.update({
      where: {
        id: params.indicationId
      },
      data: {
        kode,
        name
      },
    });
  
    return NextResponse.json(indication);
  } catch (error) {
    console.log('[indication_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
