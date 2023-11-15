"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type productBrandColumn = {
  id: string
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<productBrandColumn>[] = [
  {
    accessorKey: "name",
    header: "Nama",
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
