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
import useAnimalForm from "@/hooks/use-animal-form";

type Props = {
  closeOnSubmit: () => void;
  id?: string;
};

export default function AnimalForm({ closeOnSubmit, id }: Props) {
  const submitText = id ? "Update" : "Create";
  const { form, state, handleFormSubmit, isLoading, isPending } = useAnimalForm(
    closeOnSubmit,
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
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Species</FormLabel>
                  <FormControl>
                    <Input placeholder="Species" {...field} />
                  </FormControl>
                  <FormDescription>Species</FormDescription>
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
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" min={0} {...field} />
                  </FormControl>
                  <FormDescription>Age</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>Animal Description</FormDescription>
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
