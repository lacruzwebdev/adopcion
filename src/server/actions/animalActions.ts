"use server";

import { animalSchema } from "@/lib/formSchemas";
import { type ServerActionResponse } from "@/types/types";
import { type z } from "zod";
import { db } from "../db";
import { animals } from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth";

export async function getAnimal(
  id: string,
): Promise<ServerActionResponse<z.infer<typeof animalSchema>>> {
  const animal = await db.query.animals.findFirst({
    where: eq(animals.id, Number(id)),
  });
  if (!animal) {
    return { error: "Animal not found" };
  }
  return {
    data: {
      id: animal.id.toString(),
      name: animal.name ?? "",
      species: animal.species ?? "",
      age: animal.age ?? 0,
      description: animal.description ?? "",
      mainImage: animal.mainImage,
      gallery: animal.gallery,
    },
  };
}

export async function createAnimal(
  prevState: ServerActionResponse,
  data: z.infer<typeof animalSchema>,
): Promise<ServerActionResponse> {
  const session = await auth();
  if (!session) {
    return { error: "You must be logged in to create an animal" };
  }
  const parsedData = animalSchema.safeParse(data);
  if (!parsedData.success) return { error: "Invalid form data" };

  await db.insert(animals).values({
    name: parsedData.data.name,
    species: parsedData.data.species,
    age: parsedData.data.age,
    description: parsedData.data.description,
    mainImage: parsedData.data.mainImage ?? undefined,
    gallery: parsedData.data.gallery ?? undefined,
    createdById: session.user.id,
  });

  return { message: "Animal published" };
}

export async function editAnimal(
  prevState: ServerActionResponse,
  data: z.infer<typeof animalSchema>,
): Promise<ServerActionResponse> {
  console.log(data);
  return { message: "Success" };
}
