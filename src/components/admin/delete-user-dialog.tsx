"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useDialog from "@/hooks/use-dialog";
import { Trash } from "react-feather";
import DeleteUserButton from "./delete-user-button";
export default function DeleteUserDialog({ id }: { id: string }) {
  const { isOpen, openDialog, closeDialog, toggleDialog } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger onClick={openDialog}>
        <Trash className="cursor-pointer" size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            {"Are you sure? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DeleteUserButton id={id} onSuccess={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
