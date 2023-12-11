import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProblemsClient } from "./components/client";
import { ProblemColumn } from "./components/columns";

const problemsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const problems = await prismadb.problem.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProblems: ProblemColumn[] = problems.map((item) => ({
    id: item.id,
    kode: item.kode,
    name: item.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <ProblemsClient data={formattedProblems} />
      </div>
    </div>
  );
};

export default problemsPage;
