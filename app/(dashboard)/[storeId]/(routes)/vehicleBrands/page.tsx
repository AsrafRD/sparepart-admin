import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { VehicleBrandColumn } from "./components/columns"
import { VehicleBrandsClient } from "./components/client";

const VehicleBrandsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const vehicleBrands = await prismadb.vehicleBrand.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedVehicleBrands: VehicleBrandColumn[] = vehicleBrands.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VehicleBrandsClient data={formattedVehicleBrands} />
      </div>
    </div>
  );
};

export default VehicleBrandsPage;
