"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Alert from "../ui/alert";
import { Spinner } from "../ui/spinner";
import useUserForm from "@/hooks/use-user-form";

type Props = {
  closeOnSubmit: () => void;
  role: "admin" | "user";
  id?: string;
};

export default function UserForm({ closeOnSubmit, id, role }: Props) {
  const submitText = id ? "Update" : "Create";
  const { form, state, handleFormSubmit, isLoading, isPending } = useUserForm(
    closeOnSubmit,
    role,
    id,
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          {state.error && <Alert type={"error"} message={state.error} />}
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleFormSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>User Email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>User Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Spinner className="text-white" /> : `${submitText}`}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
