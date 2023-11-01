import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { VehicleTypeColumn } from "./components/columns"
import { VehicleTypesClient } from "./components/client";

const VehicleTypesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const vehicleTypes = await prismadb.vehicleType.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedVehicleTypes: VehicleTypeColumn[] = vehicleTypes.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VehicleTypesClient data={formattedVehicleTypes} />
      </div>
    </div>
  );
};

export default VehicleTypesPage;
