"use server";

import { signInSchema } from "@/lib/formSchemas";
import type { z } from "zod";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export async function signInOnSubmitAction(data: z.infer<typeof signInSchema>) {
  const parsedData = signInSchema.safeParse(data);
  if (!parsedData.success) return { message: "Invalid form data" };
  try {
    await signIn("nodemailer", {
      redirect: false,
      email: parsedData.data.email,
    });
    return { message: "Check your email to login" };
  } catch (e) {
    if (e instanceof AuthError && e.type === "AccessDenied") {
      return { error: "Access denied" };
    }
    console.error(e);
    return { error: "Something went wrong" };
  }
}
