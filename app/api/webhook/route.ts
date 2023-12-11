import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans";


export async function POST(req: Request) {
  const body = await req.json();
  // const event = JSON.parse(body);
  const event = body;

  // Access the signature_key directly from the parsed JSON
  const signature = event.signature_key;

  if (!signature) {
    return new NextResponse("Missing Midtrans Signature key", { status: 400 });
  }

  try {
    // Validate Midtrans signature
    // const isSignatureValid = snap.Validate(body, signature);
    // if (!isSignatureValid) {
    //   return new NextResponse("Invalid Midtrans Signature", { status: 400 });
    // }

    // Parse the incoming webhook event
    // const event = JSON.parse(body);
    const eventType = event.transaction_status;

    if (eventType === "settlement") {
      // Handle successful payment
      const orderId = event.order_id;

      const order = await prismadb.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          // Add other fields as needed
        },
        include: {
          orderItems: true,
        },
      });

      // const productIds = order.orderItems.map(
      //   (orderItem) => orderItem.productId
      // );

      // await prismadb.product.updateMany({
      //   where: {
      //     id: {
      //       in: [...productIds],
      //     },
      //   },
      //   data: {
      //     isArchived: true,
      //   },
      // });
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
