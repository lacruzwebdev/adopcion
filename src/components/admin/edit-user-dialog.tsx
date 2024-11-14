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
import { Edit } from "react-feather";
import AdminForm from "./user-form";

const EditUserDialog = ({ id }: { id: string }) => {
  const { isOpen, openDialog, closeDialog, toggleDialog } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger onClick={openDialog}>
        <Edit className="cursor-pointer" size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>{"Update admin's info"}</DialogDescription>
        </DialogHeader>
        <AdminForm closeOnSubmit={closeDialog} id={id} role="admin" />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
