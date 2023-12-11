import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductForm } from "./components/order-form";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const Page = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    // Handle the case where order is null
    return <div>Order not found</div>;
  }

  const initialData = [order];

  const formattedOrder: OrderColumn = {
    id: order.id,
    buyerName: order.buyerName,
    Email: order.Email,
    phone: order.phone,
    address: order.address,
    statusOrder: order.statusOrder,
    orderItems: order.orderItems?.map((orderItem) => ({
      productId: orderItem.productId,
      product: orderItem.product,
      name: orderItem.product.name,
      quantity: orderItem.quantity || 1, // Use a default value if quantity is not present
    })) || [],
    totalPrice: formatter.format(
      order.orderItems?.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price) * (orderItem.quantity || 1);
      }, 0) || 0
    ),
    isPaid: order.isPaid ? "Sudah" : "Belum",
    createdAt: format(order.createdAt, "dd MMMM yyyy"),
    // Tambahkan properti 'products'
    products: order.orderItems?.map((orderItem) => orderItem.product.name).join(', ') || "No products",
  };

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <OrderClient data={[formattedOrder]} />
        <ProductForm initialData={initialData} />
      </div>
    </div>
  );
};

export default Page;
