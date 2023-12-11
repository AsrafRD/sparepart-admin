import prismadb from "@/lib/prismadb";

import { IndicationForm } from "./components/indication-form";

const IndicationPage = async ({
  params
}: {
  params: { indicationId: string, storeId: string }
}) => {
  const indications = await prismadb.indication.findUnique({
    where: {
      id: params.indicationId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <IndicationForm 
          initialData={indications}
        />
      </div>
    </div>
  );
}

export default IndicationPage;
