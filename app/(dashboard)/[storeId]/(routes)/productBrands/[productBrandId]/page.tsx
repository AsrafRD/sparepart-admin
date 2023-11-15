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
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-4 pt-4">
        <ProductBrandForm initialData={productBrand} />
      </div>
    </div>
  );
}

export default productBrandPage;
