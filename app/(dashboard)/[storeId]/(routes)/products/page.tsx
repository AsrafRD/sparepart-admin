import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      vehicleBrand: true,
      vehicleType: true,
      productBrand: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    stock: item.stock,
    weight: item.weight,
    description: item.description,
    category: item.category.name,
    vehicleBrand: item.vehicleBrand.name,
    vehicleType: item.vehicleType.name,
    productBrand: item.productBrand.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
