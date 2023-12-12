import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import snap from "@/lib/midtrans";
import cron from "node-cron";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function checkUnpaidOrders() {
  const unpaidOrders = await prismadb.order.findMany({
    where: {
      isPaid: false,
      createdAt: {
        lte: new Date(Date.now() - 5 * 60 * 500),
        // lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (unpaidOrders.length === 0) {
    console.log("No unpaid orders found. Stopping the job.");
    return true; // Memberi tahu pemanggil bahwa tidak ada order yang belum dibayar
  }

  for (const order of unpaidOrders) {
    for (const orderItem of order.orderItems) {
      const updatedStock = orderItem.product.stock + orderItem.quantity;
      await prismadb.product.update({
        where: { id: orderItem.product.id },
        data: { stock: updatedStock },
      });
      await prismadb.orderItem.delete({
        where: { id: orderItem.id },
      });
    }

    await prismadb.order.delete({
      where: { id: order.id },
    });

    console.log(`Stock restored for expired order ${order.id}`);
  }

  return false; // Memberi tahu pemanggil bahwa masih ada order yang belum dibayar
}

// Fungsi untuk menjadwalkan pemeriksaan pesanan yang belum dibayar
const job = cron.schedule(
  "* * * * *",
  // "0 */20 * * *",
  async () => {
    console.log("Checking unpaid orders every minute...");
    const noUnpaidOrders = await checkUnpaidOrders();

    if (noUnpaidOrders) {
      job.stop();
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER-${timestamp}-${random}`;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const data = await req.json();
  const { selectedShippingCost, items, formData, productIds, selectedServiceData } = data;

  const itemsSnap = items.map((item: any) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  itemsSnap.push({
    id: "SHIPPING_COST",
    name: "Biaya Ongkir",
    price: selectedShippingCost,
    quantity: 1,
  });

  const orderAddress = {
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    city: data.selectedCity,
    province: data.selectedProvince,
    cost: selectedServiceData.value,
    etd: selectedServiceData.etd,
    note: selectedServiceData.note,
    srvce: selectedServiceData.srvce,
    dsc: selectedServiceData.dsc,
  };

  const joinedAddress = `
  (Provinsi       : ${orderAddress.province})
  (Kota           : ${orderAddress.city})
  (Alamat Lengkap : ${formData.address})
  (Biaya          : ${orderAddress.cost})
  (ETD            : ${orderAddress.etd})
  (Note           : ${orderAddress.note})
  (Layanan        : ${orderAddress.srvce})
  (Deskripsi      : ${orderAddress.dsc})
`;

  const itemsData = items.map((item: any) => ({
    quantity: item.quantity,
    price: item.price,
  }));

  const totalPrice = itemsData.reduce((total: any, item: any) => {
    const itemPrice = parseFloat(item.price); // Mengubah string harga menjadi angka float
    return total + item.quantity * itemPrice;
  }, 0);

  const grossAmount = totalPrice + selectedShippingCost


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

  for (const product of products) {
    const orderedItem = items.find((item: any) => item.id === product.id);
    if (orderedItem) {
      const updatedStock = product.stock - orderedItem.quantity;
      await prismadb.product.update({
        where: { id: product.id },
        data: { stock: updatedStock },
      });
    } else {
      console.error(`Ordered item with id ${product.id} not found`);
    }
  }

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => {
          const item = items.find((item: any) => item.id === productId);
          if (!item) {
            throw new Error(`Item with ID ${productId} not found`);
          }
          return {
            product: {
              connect: {
                id: productId,
              },
            },
            quantity: item.quantity,
          };
        }),
      },
      buyerName: formData.name,
      phone: formData.phone,
      address: joinedAddress,
      Email: formData.email,
    },
  });

  const successUrl = `${process.env.FRONTEND_STORE_URL}/cart?settlement=1`;
  const pendingUrl = `${process.env.FRONTEND_STORE_URL}/cart?pending=1`;
  const cancelUrl = `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`;

  const session = await snap.createTransaction({
    transaction_details: {
      order_id: order.id,
      gross_amount: grossAmount,
    },
    item_details: itemsSnap,
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
    success_redirect_url: successUrl,
    pending_redirect_url: pendingUrl,
    failure_redirect_url: cancelUrl,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    {
      url: session.redirect_url,
    },
    {
      headers: corsHeaders,
    }
  );
}
