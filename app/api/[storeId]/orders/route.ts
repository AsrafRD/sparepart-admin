import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";


const corsHeaders = {
  "Access-Control-Allow-Origin": "https://rozicsparepart.vercel.app/",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request
  ) {
  try {
    const data = await req.json();
    const orderId = data.order_id;

    console.log("data yang dikirim klien",orderId)

    if (!orderId || orderId.length === 0) {
      return new NextResponse("Invalid order id in the request body", { status: 400 });
    }
    

    const orders = await prismadb.order.findUnique({
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

    if (!orders) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Tambahkan properti isPaid ke dalam objek order
    const isPaid = orders.isPaid; // Gantilah dengan nilai yang sesuai dari database

    // Kirim respons JSON dengan properti isPaid
    return NextResponse.json({ orders, isPaid}, {headers: corsHeaders});
  } catch (error: any) {
    console.error('[order_POST] Error:', error);
    return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
  }
}
