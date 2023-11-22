"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
      <Heading
        title={`Total Orderan ( ${data.length} )`}
        description="Kelola orderan rozic sparepart"
      />
      <Separator />
      <DataTable
        searchKey="buyerName"
        columns={columns}
        data={data}
        placeholder="Cari Berdasar Nama Pembeli"
      />
    </>
  );
};
