"use client";
import { deleteUser } from "@/server/actions/adminActions";
import { Trash } from "react-feather";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
export default function DeleteUserButton({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    const res = await deleteUser(id);
    if (res.error) {
      toast.error(res.error);
    }
    if (res.message) {
      toast.success(res.message);
    }
    onSuccess();
    setIsPending(false);
  };

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleClick}>
      {isPending ? (
        <>
          <Spinner className="text-white" />
          Deleting...
        </>
      ) : (
        <>
          <Trash size={18} />
          Delete user
        </>
      )}
    </Button>
  );
}
