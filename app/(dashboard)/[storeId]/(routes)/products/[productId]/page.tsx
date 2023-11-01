import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  const products = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const vehicleBrand = await prismadb.vehicleBrand.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const vehicleType = await prismadb.vehicleType.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const productBrand = await prismadb.productBrand.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          vehicleBrands={vehicleBrand}
          vehicleTypes={vehicleType}
          productBrands={productBrand}
          initialData={products}
        />
      </div>
    </div>
  );
}

export default ProductPage;
