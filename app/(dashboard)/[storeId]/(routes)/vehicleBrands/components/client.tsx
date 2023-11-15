"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { columns, VehicleBrandColumn } from "./columns";

interface VehicleBrandColumnsClientProps {
  data: VehicleBrandColumn[];
}

export const VehicleBrandsClient: React.FC<VehicleBrandColumnsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col md:items-center md:justify-between md:flex-row">
        <Heading title={`Merek Kendaraan ( ${data.length} )`} description="Kelola merek kendaraan untuk toko rozic sparepart" />
        <Button className="w-1/3 md:w-auto mt-4 mb-1 pr-5" onClick={() => router.push(`/${params.storeId}/vehicleBrands/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Vehicle Brand" />
      <Separator />
      <ApiList entityName="vehicleBrands" entityIdName="vehiclebrandId" /> */}
    </>
  );
};
