import { NextApiRequest } from "next";
import { createHash } from "crypto";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest) {
  try {
    const serverKey = process.env.NEXT_PUBLIC_ACCESS_SERVER_KEY;
    const rawData = req.body.order_id + req.body.gross_amount + serverKey;
    const hashed = createHash("sha512").update(rawData).digest("hex");
    const signature = req.headers["signature_key"];

    const orderId = req.body.order_id;

    console.log("All Headers:", req.headers);

    console.log("Raw Data:", rawData);
    console.log("Hashed:", hashed);
    console.log("Signature:", signature);

    if (hashed === signature) {
      if (req.body.transaction_status === "settlement") {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (order) {
          await prisma.order.update({
            where: { id: orderId },
            data: { isPaid: true },
          });
        } else {
          return new NextResponse(new TextEncoder().encode("Order not found"), {
            status: 404,
          });
        }
      }

      return new NextResponse(
        new TextEncoder().encode("Callback processed successfully"),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        new TextEncoder().encode("Invalid signature key"),
        { status: 400 }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      new TextEncoder().encode(`Error processing callback: ${error.message}`),
      { status: 500 }
    );
  }
}
