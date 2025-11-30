"use client";

import React from "react";
import type { Part } from "@/types/part";
import { Table, type ColumnDef } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type UsersTableProps = {
  parts: Part[];
  onEditPart?: (user: Part) => void;
  onClickDeletePart?: (user: Part) => void;
  className?: string;
};

export function WarehouseTable({
  parts,
  onEditPart,
  onClickDeletePart,
  className,
}: UsersTableProps) {
  const columns: ColumnDef<Part>[] = [
    {
      key: "name",
      header: "Name",
      className: "table-cell--truncate",
      render: (part) => part.name,
    },
    {
      key: "part_number",
      header: "Part Number",
      className: "table-cell--truncate",
      render: (part) => part.part_number,
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (part) => `${part.quantity}/${part.min_quantity}` || "—",
    },
    {
      key: "price",
      header: "Price",
      render: (part) => part.price,
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (part) => part.supplier,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (part) => {
        const raw =
          ([part] as any).created_at ?? (part as any).createdAt ?? null;
        if (!raw) return "—";
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return String(raw);
        return d.toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "table-cell--actions",
      render: (user) => (
        <>
          {" "}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditPart?.(user)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClickDeletePart?.(user)}
          >
            <Trash size={16} />
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      data={parts}
      columns={columns}
      pageSize={15}
      getRowKey={(u) => u.id}
      className={className}
    />
  );
}
