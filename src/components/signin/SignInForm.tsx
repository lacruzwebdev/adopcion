"use client";
import { Input } from "../ui/input";
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
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { signInOnSubmitAction } from "@/server/signInActions";
import { signInSchema } from "@/lib/signInSchema";
import { useState } from "react";
import Alert from "../ui/alert";

export default function SignInForm() {
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    message: string;
  }>({ type: "success", message: "" });
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const res = await signInOnSubmitAction(data);
    if (res?.message) {
      return setMsg({ type: "success", message: res.message });
    }
    if (res?.error) {
      return setMsg({ type: "error", message: res.error });
    }

    setMsg({ type: "success", message: "" });
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Form {...form}>
        <form
          className="w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
      {/* Warning */}

      {msg.message && <Alert type={msg.type} message={msg.message} />}
    </div>
  );
}
