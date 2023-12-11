import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const orders = await prismadb.order.findUnique({
        where: {
          id: params.orderId
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
  
      console.log(orders)
    return NextResponse.json(orders);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const order = await prismadb.order.delete({
      where: {
        id: params.orderId
      },
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { statusOrder } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!statusOrder) {
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

    //hal janggal
    await prismadb.order.update({
      where: {
        id: params.orderId
      },
      data: {
        statusOrder
      },
    });

    const order = await prismadb.order.update({
      where: {
        id: params.orderId
      },
      data: {
        statusOrder,
      },
    })
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
