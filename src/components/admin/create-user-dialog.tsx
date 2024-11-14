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
import { Plus } from "react-feather";
import UserForm from "./user-form";

const CreateUserDialog = ({ role }: { role: "admin" | "user" }) => {
  const { isOpen, openDialog, closeDialog, toggleDialog } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger onClick={openDialog}>
        <Plus className="rounded-full bg-primary p-1" color="white" size={32} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Create New ${role.charAt(0).toUpperCase() + role.slice(1)}`}</DialogTitle>
          <DialogDescription>
            {`Fill in the email and name to add a new ${role}.`}
          </DialogDescription>
        </DialogHeader>
        <UserForm closeOnSubmit={closeDialog} role={role} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
