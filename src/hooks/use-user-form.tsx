import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createUser, editUser } from "@/server/actions/adminActions";
import { toast } from "sonner";
import { getUser } from "@/server/actions/userActions";

export default function useUserForm(
  closeOnSubmit: () => void,
  role: "admin" | "user",
  id?: string,
) {
  const serverAction = id ? editUser : createUser;
  const [state, formAction, isPending] = useActionState(serverAction, {
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().trim().email(),
        name: z.string().trim().min(3),
      }),
    ),
    defaultValues: { email: "", name: "" },
  });

  useEffect(() => {
    if (id) {
      async function fetchUser(id: string) {
        setIsLoading(true);
        const user = await getUser(id);
        if (user.data) {
          form.reset({
            email: user.data.email,
            name: user.data.name ?? "",
          });
        }
        setIsLoading(false);
      }
      fetchUser(id).catch((err) => console.log(err));
    }
  }, [form, id]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      closeOnSubmit();
    }
  }, [state, closeOnSubmit, id]);

  const handleFormSubmit = (values: { email: string; name: string }) => {
    startTransition(() => {
      formAction({ ...values, role, id: id ?? "" });
    });
  };

  return { form, formAction, handleFormSubmit, state, isLoading, isPending };
}
