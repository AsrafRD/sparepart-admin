import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("order id is required", { status: 400 });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId
      },
      include: {
        orderItems: true
      }
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[order_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

