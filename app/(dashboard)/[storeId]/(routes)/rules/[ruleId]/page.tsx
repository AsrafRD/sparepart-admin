import prismadb from "@/lib/prismadb";

import { RuleForm } from "./components/rule-form";

const ProblemPage = async ({
  params,
}: {
  params: { ruleId: string; storeId: string };
}) => {
  const rules = await prismadb.rule.findUnique({
    where: {
      id: params.ruleId,
    },
  });

  const problems = await prismadb.problem.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const indications = await prismadb.indication.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <RuleForm
          problems={problems}
          indications={indications}
          initialData={rules}
        />
      </div>
    </div>
  );
};

export default ProblemPage;
