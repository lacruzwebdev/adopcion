"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DeleteUserDialog from "./delete-user-dialog";
import EditUserDialog from "./edit-user-dialog";
import type { userSchema } from "@/lib/formSchemas";
import type { z } from "zod";

export const columns: ColumnDef<z.infer<typeof userSchema>>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const img: string = row.original.image ?? "";
      const name: string = row.getValue("name") ?? "Sin nombre establecido";
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={img} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <p>{name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <EditUserDialog id={row.original.id} />
          <DeleteUserDialog id={row.original.id} />
        </div>
      );
    },
  },
];
