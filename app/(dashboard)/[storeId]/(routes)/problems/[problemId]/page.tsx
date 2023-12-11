import prismadb from "@/lib/prismadb";

import { ProblemForm } from "./components/problem-form";

const ProblemPage = async ({
  params
}: {
  params: { problemId: string, storeId: string }
}) => {
  const problems = await prismadb.problem.findUnique({
    where: {
      id: params.problemId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-6 pt-4">
        <ProblemForm 
          initialData={problems}
        />
      </div>
    </div>
  );
}

export default ProblemPage;
