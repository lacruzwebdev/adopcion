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
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/formSchemas";
import { Button } from "../ui/button";
import { getZodDefaults } from "@/lib/apiUtils";
import type { z } from "zod";
import { updateProfile } from "@/server/actions/userActions";
import { toast } from "sonner";
import { profileLabels } from "@/lib/schemaLabels";

type Props = {
  profile: z.infer<typeof profileSchema>;
};

export default function EditProfileForm({ profile }: Props) {
  const initialValues = profile ? profile : getZodDefaults(profileSchema);
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });
  const onSubmit = form.handleSubmit(async (data) => {
    const res = await updateProfile(data as z.infer<typeof profileSchema>);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(res?.message);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-8">
        {Object.keys(initialValues).map((key) => {
          const fieldKey = key as keyof z.infer<typeof profileSchema>;
          return (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{profileLabels[fieldKey]}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={key}
                      className="w-full rounded-full px-4 py-2 text-black"
                    />
                  </FormControl>
                  <FormDescription>{`Your ${key}`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit" className="col-span-2">
          Update
        </Button>
      </form>
    </Form>
  );
}
