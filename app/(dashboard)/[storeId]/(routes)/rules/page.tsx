import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProblemsClient } from "./components/client";
import { RuleColumn } from "./components/columns";

const problemsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const rules = await prismadb.rule.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedRules: RuleColumn[] = rules.map((item) => ({
    id: item.id,
    kondisi: item.kondisi,
    hasil: item.hasil,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <ProblemsClient data={formattedRules} />
      </div>
    </div>
  );
};

export default problemsPage;
