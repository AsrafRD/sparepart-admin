import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const formDataValue = formData.orderId;

    if (typeof formDataValue !== 'string') {
      return new NextResponse("Invalid order id in the request body", { status: 400 });
    }

    const orderId: string = formDataValue;

    const order = await prismadb.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Tambahkan properti isPaid ke dalam objek order
    const isPaid = order.isPaid; // Gantilah dengan nilai yang sesuai dari database

    // Kirim respons JSON dengan properti isPaid
    return Response.json({ order, isPaid});
  } catch (error: any) {
    console.error('[order_POST] Error:', error);
    return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
  }
}