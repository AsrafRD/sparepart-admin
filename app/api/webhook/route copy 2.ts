import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { headers } from "next/headers"
import snap from "@/lib/midtrans";
import { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
      const body = req.body || {};
      // Check if headers is defined before calling get
      const signature = headers().get("signature_key") as string
      console.log('signature key nya ni bro', signature)

      if (signature === undefined) {
        return new NextResponse("Missing Midtrans Signature", { status: 400 });
      }

      // Validasi tanda tangan Midtrans
      const isSignatureValid = snap.signatureKeyIsValid(
        JSON.stringify(body),
        String(signature)
      );
      if (!isSignatureValid) {
        return new NextResponse("Invalid Midtrans Signature", { status: 400 });
      }

      const event = body;
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
          },
        });

        const productIds = order.orderItems.map(
          (orderItem) => orderItem.productId
        );

        await prismadb.product.updateMany({
          where: {
            id: {
              in: [...productIds],
            },
          },
          data: {
            isArchived: true,
          },
        });
      }

      // Additional logic for processing your callback
      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const hashed = createHash("sha512")
        .update(event.data.order_id + event.data.gross_amount + serverKey)
        .digest("hex");

      if (hashed === String(signature)) {
        if (event.data.transaction_status === "capture") {
          // Logika untuk menangani status transaksi 'capture'
          const updatedOrder = await prismadb.order.update({
            where: { id: orderId },
            data: { statusOrder: "true" }, // Replace 'true' with your desired status value
          });

          if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
          }
        }

        return res
          .status(200)
          .json({ message: "Webhook processed successfully" });
      } else {
        return res.status(400).json({ error: "Invalid signature key" });
      }
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: `Error processing webhook: ${error.message}` });
    }
}