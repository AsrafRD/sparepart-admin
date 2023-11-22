"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  buyerName: string;
  Email: string;
  phone: string;
  address: string;
  isPaid: string;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "buyerName",
    header: "Name",
  },
  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "products",
    header: "Produk",
  },
  {
    accessorKey: "phone",
    header: "Whatsapp",
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Bayar",
  },
  {
    accessorKey: "isPaid",
    header: "Status Bayar",
  },
  {
    accessorKey: "statusOrder",
    header: "Status Order",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];