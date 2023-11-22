import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans";
import axios from "axios";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


async function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
}

function calculateTotalAmount(items: any[]) {
  let totalAmount = 0;

  items.forEach((item: any) => {
    const itemPrice = item.price * item.quantity;
    totalAmount += itemPrice;
  });

  return totalAmount;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
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

    // Create a list of items for Midtrans
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
        buyerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        Email: formData.email,
      },
    });

    const successUrl = `${process.env.FRONTEND_STORE_URL}/cart?settlement=1`;
    const cancelUrl = `${process.env.FRONTEND_STORE_URL}/cart?expire=1`;
    const {serverKey} = snap()

    const totalAmount = calculateTotalAmount(items);

    // Create a transaction on Midtrans and get Snap token
    const snapResponse = await axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        transaction_details: {
          order_id: order.id,
          gross_amount: totalAmount,
        },
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
        item_details: items,
        success_redirect_url: successUrl,
        failure_redirect_url: cancelUrl,
        metadata: {
          orderId: order.id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(`${serverKey}`).toString("base64")}`,
        },
      }
    );

    // Send Snap token in the response
    return NextResponse.json(
      {
        url: snapResponse.data.redirect_url,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}