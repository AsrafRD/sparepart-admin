import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
const midtransClient = require("midtrans-client");
// import snap from "@/lib/midtrans"; // Impor modul Midtrans

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Fungsi untuk menghasilkan ID pesanan yang unik
function generateOrderId() {
  const timestamp = Date.now(); // Waktu saat pesanan dibuat
  const random = Math.floor(Math.random() * 1000); // Nomor acak
  return `ORDER-${timestamp}-${random}`;
}

// Fungsi untuk menghitung total jumlah pembayaran
function calculateTotalAmount(items: any[]) {
  let totalAmount = 0;

  items.forEach((item: { price: number; quantity: number; }) => {
    const itemPrice = item.price * item.quantity;
    totalAmount += itemPrice;
  });

  return totalAmount;
}
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  // Buat daftar item untuk Midtrans
  const items = products.map((product) => ({
    id: product.id,
    price: product.price.toNumber(),
    quantity: 1,
    name: product.name,
  }));

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey : process.env.NEXT_PUBLIC_ACCESS_SERVER_KEY,
    clientKey : process.env.NEXT_PUBLIC_ACCESS_CLIENT_KEY,
  })

  // Buat transaksi Midtrans
  const parameter = {
    transaction_details: {
      order_id: generateOrderId(), // Menggunakan generateOrderId
      gross_amount: calculateTotalAmount(items), // Menggunakan calculateTotalAmount
    }
  };
  
  const transaction = await snap.createTransaction(parameter, items)
  .then((transaction: { token: any; })=> {
    let transactionToken = transaction.token;
    console.log('transactionToken:',transactionToken)
  });

  return NextResponse.json({ url: sessionStorage.url }, {
    headers: corsHeaders
  });
}
