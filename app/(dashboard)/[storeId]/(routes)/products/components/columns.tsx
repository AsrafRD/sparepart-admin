"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string;
  price: string;
  category: string;
  vehicleBrand: string;
  vehicleType: string;
  productBrand: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nama Produk",
  },
  
  {
    accessorKey: "price",
    header: "Harga",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "vehicleBrand",
    header: "Merek Kendaraan",
  },
  {
    accessorKey: "vehicleType",
    header: "Tipe Kendaraan",
  },
  {
    accessorKey: "productBrand",
    header: "Merek Produk",
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
  },
  {
    accessorKey: "isArchived",
    header: "Tampilkan",
  },
  {
    accessorKey: "isFeatured",
    header: "Sediakan",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
