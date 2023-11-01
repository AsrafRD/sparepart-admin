import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("X-Midtrans-Signature");

  if (!signature) {
    return new NextResponse("Missing Midtrans Signature", { status: 400 });
  }

  try {
    // Validasi tanda tangan Midtrans
    const isSignatureValid = snap.signatureKeyIsValid(body, signature);
    if (!isSignatureValid) {
      return new NextResponse("Invalid Midtrans Signature", { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const orderId = event.data.order_id;

    if (eventType === "transaction.status.settlement") {
      // Logika untuk menangani pembayaran yang berhasil
      const order = await prismadb.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
        include: {
          orderItems: true,
        }
      });

      const productIds = order.orderItems.map((orderItem) => orderItem.productId);

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productIds],
          },
        },
        data: {
          isArchived: true,
        }
      });
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
