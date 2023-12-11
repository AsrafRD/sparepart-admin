"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type RuleColumn = {
  id: string;
  kondisi: string;
  hasil: string;
}

export const columns: ColumnDef<RuleColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "kondisi",
    header: "Kondisi (gejala)",
  },
  {
    accessorKey: "hasil",
    header: "Hasil Test",
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
