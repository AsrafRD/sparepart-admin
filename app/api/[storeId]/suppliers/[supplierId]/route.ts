import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    if (!params.supplierId) {
      return new NextResponse("Vehicle brand id is required", { status: 400 });
    }

    const supplier = await prismadb.supplier.findUnique({
      where: {
        id: params.supplierId
      }
    });
  
    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[supplier_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { supplierId: string, storeId: string } }
) {
  try {const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.supplierId) {
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

    const supplier = await prismadb.supplier.delete({
      where: {
        id: params.supplierId
      }
    });
  
    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[supplier_DELETE]', error);
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

    const { name, address, phone } = body;

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

    const supplier = await prismadb.supplier.update({
      where: {
        id: params.vehileBrandId
      },
      data: {
        name,
        address,
        phone
      }
    });
  
    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[supplier_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
