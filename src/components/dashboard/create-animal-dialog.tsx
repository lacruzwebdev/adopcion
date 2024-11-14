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
import AnimalForm from "./animal-form";

const CreateAnimalDialog = () => {
  const { isOpen, openDialog, closeDialog, toggleDialog } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger onClick={openDialog}>
        <Plus className="rounded-full bg-primary p-1" color="white" size={32} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Publish New Animal`}</DialogTitle>
          <DialogDescription>{`Fill in the animal details.`}</DialogDescription>
        </DialogHeader>
        <AnimalForm closeOnSubmit={closeDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnimalDialog;
