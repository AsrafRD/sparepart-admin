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
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <VehicleBrandForm initialData={vehicleBrand} />
      </div>
    </div>
  );
}

export default VehicleBrandPage;
