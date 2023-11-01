import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { productBrandColumn } from "./components/columns"
import { ProductBrandsClient } from "./components/client";

const productBrandsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const productBrands = await prismadb.productBrand.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedproductBrands: productBrandColumn[] = productBrands.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductBrandsClient data={formattedproductBrands} />
      </div>
    </div>
  );
};

export default productBrandsPage;
