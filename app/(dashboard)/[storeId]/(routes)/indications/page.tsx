import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { IndicationsClient } from "./components/client";
import { IndicationColumn } from "./components/columns";

const IndicationsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const indications = await prismadb.indication.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedIndications: IndicationColumn[] = indications.map((item) => ({
    id: item.id,
    kode: item.kode,
    name: item.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <IndicationsClient data={formattedIndications} />
      </div>
    </div>
  );
};

export default IndicationsPage;
