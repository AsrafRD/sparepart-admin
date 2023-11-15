import prismadb from "@/lib/prismadb";

import { VehicleTypeForm } from "./components/vehicleType-form";

const VehicleTypePage = async ({
  params
}: {
  params: { vehicleTypeId: string }
}) => {
  const vehicleType = await prismadb.vehicleType.findUnique({
    where: {
      id: params.vehicleTypeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <VehicleTypeForm initialData={vehicleType} />
      </div>
    </div>
  );
}

export default VehicleTypePage;
