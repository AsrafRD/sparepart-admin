import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";


export async function POST(req: Request) {
  const body = await req.json();
  const event = body;

  const signature = event.signature_key;

  if (!signature) {
    return new NextResponse("Missing Midtrans Signature key", { status: 400 });
  }

  try {
    
    const eventType = event.transaction_status;

    if (eventType === "settlement") {
      const orderId = event.order_id;

      await prismadb.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
        include: {
          orderItems: true,
        },
      });
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
