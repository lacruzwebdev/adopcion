"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { uploadAdminImage } from "@/server/actions/adminActions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UploadAvatar({ id }: { id: string }) {
  const [error, setError] = useState("");
  const [state, formAction, isPending] = useActionState(uploadAdminImage, {
    data: null,
  });
  useEffect(() => {
    toast(state.message);
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 1024 * 1024) {
      return setError("File too large: Max size is 1MB.");
    }
    setError("");
  };

  return (
    <>
      <form action={formAction} className="inline-flex flex-col gap-2">
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Input type="file" name="file" onChange={handleFileChange} />
        <input type="hidden" name="id" value={id} />
        {state?.error && (
          <p className="text-sm text-destructive">{state?.error}</p>
        )}
        <Button type="submit" disabled={isPending || error.length > 0}>
          {isPending ? (
            <>
              <Spinner className="text-white" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </>
  );
}
