"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type IndicationColumn = {
  id: string;
  kode: string;
  name: string;
}

export const columns: ColumnDef<IndicationColumn>[] = [
  {
    accessorKey: "kode",
    header: "Kode Gejala",
  },
  {
    accessorKey: "name",
    header: "Gejala",
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
