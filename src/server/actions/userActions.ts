"use server";

import { profileSchema, type userSchema } from "@/lib/formSchemas";
import { type ServerActionResponse } from "@/types/types";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { profiles, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import type { z } from "zod";

export async function getProfile(
  id: string,
): Promise<ServerActionResponse<z.infer<typeof profileSchema>>> {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };
  const userExists = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!userExists) return { error: "User not found" };
  const profile = await db.query.profiles.findFirst();
  if (!profile) return { error: "Por not found" };

  return {
    data: {
      title: profile.title ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      website: profile.website ?? "",
      twitter: profile.twitter ?? "",
      instagram: profile.instagram ?? "",
      description: profile.description ?? "",
    },
  };
}

export async function updateProfile(
  data: z.infer<typeof profileSchema>,
): Promise<ServerActionResponse> {
  const session = await auth();
  const parsedData = profileSchema.safeParse(data);
  if (!session) return { error: "Unauthorized" };
  if (!parsedData.success) return { error: "Invalidad form data" };

  const ownProfile = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!ownProfile) {
    return { error: "User not found" };
  }

  await db
    .update(profiles)
    .set(parsedData.data)
    .where(eq(profiles.userId, session.user.id));

  revalidatePath("/dashboard/profile");
  return { message: "Profile updated" };
}

export async function getUsers(): Promise<
  ServerActionResponse<z.infer<typeof userSchema>[]>
> {
  const usersData = await db.query.users.findMany({
    where: eq(users.role, "user"),
    orderBy: (users, { asc }) => [asc(users.createdAt)],
  });
  if (!users) return { error: "Error fetching users" };
  return { data: usersData };
}

export async function getUser(
  id: string,
): Promise<ServerActionResponse<z.infer<typeof userSchema>>> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) {
    return { error: "User not found" };
  }
  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}
