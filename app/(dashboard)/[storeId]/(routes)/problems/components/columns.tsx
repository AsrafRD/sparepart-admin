"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProblemColumn = {
  id: string
  kode: string
  name: string;
}

export const columns: ColumnDef<ProblemColumn>[] = [
  {
    accessorKey: "kode",
    header: "Kode kerusakan",
  },
  {
    accessorKey: "name",
    header: "Nama Kerusakan",
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
