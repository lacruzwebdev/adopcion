"use server";
import "server-only";

import { auth } from "../auth";
import type { ServerActionResponse } from "@/types/types";
import { avatarSchema, userSchema } from "@/lib/formSchemas";
import { api } from "@/trpc/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { minioClient } from "../s3/config";
import { env } from "@/env";
import { isAdmin, isSuperAdmin } from "@/lib/authUtils";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { profiles, users } from "../db/schema";

export async function createUser(
  prevState: ServerActionResponse,
  input: { email: string; name: string; role: "admin" | "user" },
): Promise<ServerActionResponse> {
  const session = await auth();
  if (
    !session ||
    !isAdmin(session.user) ||
    (input.role === "admin" && !isSuperAdmin(session.user))
  ) {
    return { error: "Unauthorized" };
  }
  const parsed = z
    .object({
      email: z.string().trim().email(),
      name: z.string().trim().min(3),
      role: z.enum(["admin", "user"]),
    })
    .safeParse(input);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
      issues: parsed.error?.issues,
    };
  }

  const userExists = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });
  if (userExists) {
    return { error: "User already exists" };
  }
  const [newUser] = await db
    .insert(users)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
    })
    .returning({ id: users.id, role: users.role });

  if (newUser && newUser.role === "user") {
    await db.insert(profiles).values({
      userId: newUser.id,
    });
  }

  revalidatePath("/admin/admins", "page");
  return { message: "User created successfully" };
}

export async function deleteUser(id: string): Promise<ServerActionResponse> {
  if (!id) return { error: "No form data" };
  const parsed = z.string().safeParse(id);

  if (!parsed.success) {
    return {
      error: "Invalid data",
      issues: parsed.error?.issues,
    };
  }
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, parsed.data))
    .returning({ id: users.id });

  if (!deletedUser) {
    return { error: "User not found" };
  }

  revalidatePath("/admin", "page");
  return { message: "User deleted successfully" };
}

export async function editUser(
  prevState: ServerActionResponse,
  data: { id: string; email: string; name: string; role: "admin" | "user" },
): Promise<ServerActionResponse> {
  const parsed = z
    .object({
      id: z.string().trim(),
      email: z.string().trim().email(),
      name: z.string().trim().min(3),
    })
    .safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid form data",
      issues: parsed.error?.issues,
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, data.id),
  });
  if (!user) {
    return { error: "User not found" };
  }
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
    })
    .where(eq(users.id, data.id));

  revalidatePath("/admin/admins");

  return { message: "User updated successfully" };
}

export async function uploadAdminImage(
  prevState: ServerActionResponse,
  formData: FormData,
): Promise<ServerActionResponse> {
  const session = await auth();
  const file = formData.get("file");
  const userId = formData.get("id");
  if (!session || session.user.id !== userId) {
    return { error: "Unauthorized" };
  }

  if (!file) return { error: "No file selected" };

  const parsedData = avatarSchema.safeParse({ userId, file });
  if (!parsedData.success) {
    return {
      error: "Invalid file",
      issues: parsedData.error?.issues,
    };
  }

  const parsedFile = parsedData.data.file;
  const parsedUserId = parsedData.data.userId;
  const arrayBuffer = await parsedFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const bucket = "avatars";
  const bucketExists = await minioClient.bucketExists(bucket);
  const destinationObject = `${parsedUserId}-avatar.${parsedFile.name.split(".").at(-1)}`;

  if (!bucketExists) {
    await minioClient.makeBucket(bucket);
  }
  if (file) {
    await minioClient.putObject(
      bucket,
      destinationObject,
      buffer,
      buffer.length,
      {
        "Content-type": parsedFile.type,
      },
    );
    const url = `${env.NEXT_PUBLIC_S3_URL}/${bucket}/${destinationObject}`;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) return { error: "User not found" };
    await db
      .update(users)
      .set({
        image: url,
      })
      .where(eq(users.id, userId));
  }

  revalidatePath("/admin/profile");
  return { message: "Image uploaded successfully" };
}

export async function getAdmins(): Promise<
  ServerActionResponse<z.infer<typeof userSchema>[]>
> {
  const usersData = await db.query.users.findMany({
    where: eq(users.role, "admin"),
    orderBy: (users, { asc }) => [asc(users.createdAt)],
  });
  if (!users) return { error: "Error fetching users" };
  return { data: usersData.map((user) => userSchema.parse(user)) };
}
