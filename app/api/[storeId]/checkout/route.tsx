import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans"; // Impor modul Midtrans

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Fungsi untuk menghasilkan ID pesanan yang unik
function generateOrderId() {
  const timestamp = Date.now(); // Waktu saat pesanan dibuat
  const random = Math.floor(Math.random() * 1000); // Nomor acak
  return `ORDER-${timestamp}-${random}`;
}

// Fungsi untuk menghitung total jumlah pembayaran
function calculateTotalAmount(items: any[]) {
  let totalAmount = 0;

  items.forEach((item: { price: number; quantity: number }) => {
    const itemPrice = item.price * item.quantity;
    totalAmount += itemPrice;
  });

  return totalAmount;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product id is required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // Buat daftar item untuk Midtrans
  const items = products.map((product) => ({
    id: product.id,
    price: product.price.toNumber(),
    quantity: 1,
    name: product.name,
  }));

  // const order = await prismadb.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: productIds.map((productId: string) => ({
  //         product: {
  //           connect: {
  //             id: productId,
  //           },
  //         },
  //       })),
  //     },
  //   },
  // });

  const successUrl = `${process.env.FRONTEND_STORE_URL}/cart?/success=1`; // Ganti sesuai kebijakan URL Anda
  const cancelUrl = `${process.env.FRONTEND_STORE_URL}/cart?/cancel=1`; // Ganti sesuai kebijakan URL Anda

  const session = await snap.createTransaction({
    transaction_details: {
      order_id: generateOrderId(), // Menggunakan ID pesanan dari basis data Anda
      gross_amount: calculateTotalAmount(items), // Total jumlah pembayaran
    },
    item_details: items,
    success_redirect_url: successUrl, // URL setelah pembayaran berhasil
    failure_redirect_url: cancelUrl, // URL jika pembayaran dibatalkan
    metadata: {
      orderId: generateOrderId(),
      // orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.redirect_url },
    {
      headers: corsHeaders,
    }
  );
}
