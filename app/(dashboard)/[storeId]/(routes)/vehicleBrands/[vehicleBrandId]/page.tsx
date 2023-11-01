import prismadb from "@/lib/prismadb";

import { VehicleBrandForm } from "./components/vehicleBrand-form";

const VehicleBrandPage = async ({
  params
}: {
  params: { vehicleBrandId: string }
}) => {
  const vehicleBrand = await prismadb.vehicleBrand.findUnique({
    where: {
      id: params.vehicleBrandId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VehicleBrandForm initialData={vehicleBrand} />
      </div>
    </div>
  );
}

export default VehicleBrandPage;
