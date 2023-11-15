import prismadb from "@/lib/prismadb";

import { OrderForm } from "./components/order-form";

const productBrandPage = async ({
  params
}: {
  params: { OrderId: string }
}) => {
  const Order = await prismadb.order.findUnique({
    where: {
      id: params.OrderId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={Order} />
      </div>
    </div>
  );
}

export default productBrandPage;
