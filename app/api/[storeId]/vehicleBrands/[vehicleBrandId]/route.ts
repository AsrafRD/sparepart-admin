import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { vehicleBrandId: string } }
) {
  try {
    if (!params.vehicleBrandId) {
      return new NextResponse("Vehicle brand id is required", { status: 400 });
    }

    const vehicleBrand = await prismadb.vehicleBrand.findUnique({
      where: {
        id: params.vehicleBrandId
      }
    });
  
    return NextResponse.json(vehicleBrand);
  } catch (error) {
    console.log('[VEHICLEBRAND_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleBrandId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.vehicleBrandId) {
      return new NextResponse("Vehicle brand id is required", { status: 400 });
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

    const vehicleBrand = await prismadb.vehicleBrand.delete({
      where: {
        id: params.vehicleBrandId
      }
    });
  
    return NextResponse.json(vehicleBrand);
  } catch (error) {
    console.log('[VEHICLEBRAND_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { vehileBrandId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.vehileBrandId) {
      return new NextResponse("Vehicle brand id is required", { status: 400 });
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

    const vehicleBrand = await prismadb.vehicleBrand.update({
      where: {
        id: params.vehileBrandId
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(vehicleBrand);
  } catch (error) {
    console.log('[VEHICLEBRAND_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
