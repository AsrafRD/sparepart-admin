"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { RuleColumn, columns } from "./columns";

interface ProblemsClientProps {
  data: RuleColumn[];
};

export const ProblemsClient: React.FC<ProblemsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex flex-col md:items-center md:justify-between md:flex-row">
        <Heading title={`Test kendaraan ( ${data.length} )`} description="Kelola test kendaraan untuk sistem pakar diagnosa kerusakan di rozic sparepart" />
        <Button className="w-1/3 md:w-auto mt-4 mb-1 pr-5" onClick={() => router.push(`/${params.storeId}/rules/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} placeholder="Cari Berdasar Nama hasil"/>
      {/* <Heading title="API" description="API Calls for Problems" />
      <Separator />
      <ApiList entityName="Problems" entityIdName="ProblemId" /> */}
    </>
  );
};
