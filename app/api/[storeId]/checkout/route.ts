import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans"; // Impor modul Midtrans
import { auth } from "@clerk/nextjs";

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

  items.forEach((item: any) => {
    // Perbaikan: Tambahkan tipe "any" pada parameter
    const itemPrice = item.price * item.quantity;
    totalAmount += itemPrice;
  });

  return totalAmount;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
    const data = await req.json();
    const { productIds, formData } = data;

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

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
        buyerName: formData.name, // Menyimpan nama pembeli
        phone: formData.phone, // Menyimpan nomor telepon pembeli
        address: formData.address, // Menyimpan alamat pembeli
        Email: formData.email, // Menyimpan alamat pembeli
      },
    });

    const successUrl = `${process.env.FRONTEND_STORE_URL}/cart?settlement=1`; // Ganti sesuai kebijakan URL Anda
    const pendingUrl = `${process.env.FRONTEND_STORE_URL}/cart?pending=1`; // Ganti sesuai kebijakan URL Anda
    const cancelUrl = `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`; // Ganti sesuai kebijakan URL Anda

    const session = await snap.createTransaction({
      transaction_details: {
        // order_id: order.id, // Menggunakan ID pesanan dari basis data Anda
        order_id: order.id, // Menggunakan ID pesanan dari basis data Anda
        gross_amount: calculateTotalAmount(items), // Total jumlah pembayaran
      },
      item_details: items,
      customer_details: {
        first_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        billing_address: {
          first_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
      },
      success_redirect_url: successUrl, // URL setelah pembayaran berhasil
      pending_redirect_url: pendingUrl, // URL jika pembayaran dibatalkan
      failure_redirect_url: cancelUrl, // URL jika pembayaran dibatalkan
      metadata: {
        orderId: order.id,
      },
    });

    // const orderId = order.id;

    // await prismadb.order.update({
    //   where: { id: orderId },
    //   data: { isPaid: true }, // Ubah status pembayaran menjadi "true"
    // });

    // const orderItem = await prismadb.orderItem.findUnique({
    //   where: {
    //     id: order.id, // Ganti dengan ID keranjang sesuai dengan implementasi Anda
    //   },
    // });
    // if (orderItem) {
    //   await prismadb.orderItem.delete({
    //     where: {
    //       id: orderItem.id,
    //     },
    //   });
    // }

    // const updatedCart = productIds.filter((item: any) => !productIds.includes(item.id));

    return NextResponse.json(
      {
        url: session.redirect_url,
        // productIds: updatedCart
      },
      {
        headers: corsHeaders,
      }
    );
  // } catch (error) {
  //   console.log("[CHECKOUT_POST]", error);
  //   return new NextResponse("Internal error", { status: 500 });
  // }
}
