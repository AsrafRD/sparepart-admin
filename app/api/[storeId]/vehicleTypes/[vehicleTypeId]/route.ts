import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { vehicleTypeId: string } }
) {
  try {
    if (!params.vehicleTypeId) {
      return new NextResponse("Vehicle type id is required", { status: 400 });
    }

    const vehicleType = await prismadb.vehicleType.findUnique({
      where: {
        id: params.vehicleTypeId
      }
    });
  
    return NextResponse.json(vehicleType);
  } catch (error) {
    console.log('[VEHICLETYPES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleTypeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.vehicleTypeId) {
      return new NextResponse("Vehicle type id is required", { status: 400 });
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

    const vehicleType = await prismadb.vehicleType.delete({
      where: {
        id: params.vehicleTypeId
      }
    });
  
    return NextResponse.json(vehicleType);
  } catch (error) {
    console.log('[VEHICLETYPES_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { vehicleTypeId: string, storeId: string } }
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

    if (!params.vehicleTypeId) {
      return new NextResponse("Vehicle type id is required", { status: 400 });
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

    const vehicleType = await prismadb.vehicleType.update({
      where: {
        id: params.vehicleTypeId
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(vehicleType);
  } catch (error) {
    console.log('[VEHICLETYPES_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
