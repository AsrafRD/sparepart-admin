import prismadb from "@/lib/prismadb";

import { ProductBrandForm } from "./components/productBrand-form";

const productBrandPage = async ({
  params
}: {
  params: { productBrandId: string }
}) => {
  const productBrand = await prismadb.productBrand.findUnique({
    where: {
      id: params.productBrandId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductBrandForm initialData={productBrand} />
      </div>
    </div>
  );
}

export default productBrandPage;
