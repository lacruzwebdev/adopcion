import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email({
    message: "Invalid email",
  }),
});

export const userSchema = z
  .object({
    id: z.string().trim(),
    email: z.string().trim().email({
      message: "Invalid email",
    }),
    name: z
      .string()
      .trim()
      .min(3, {
        message: "Name must be at least 3 characters",
      })
      .nullable(),
    role: z.enum(["superadmin", "admin", "user"]),
    image: z.string().url().nullable(),
    createdAt: z.string().datetime(),
  })
  .strip();

export const avatarSchema = z.object({
  userId: z.string().trim(),
  file: z
    .instanceof(File)
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: "The profile picture must be a maximum of 1MB.",
    })
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Only images are allowed to be sent.",
    }),
});

export const profileSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, {
        message: "Title must be at least 3 characters",
      })
      .nullable()
      .transform((val) => val ?? ""),
    bio: z
      .string()
      .trim()
      .min(3, { message: "Bio must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
    location: z
      .string()
      .trim()
      .min(3, { message: "Location must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
    website: z
      .string()
      .trim()
      .min(3, { message: "Website must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
    twitter: z
      .string()
      .trim()
      .min(3, { message: "Twitter must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
    instagram: z
      .string()
      .trim()
      .min(3, { message: "Instagram must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description must be at least 3 characters" })
      .nullable()

      .transform((val) => val ?? ""),
  })
  .strip();

export const animalSchema = z
  .object({
    id: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(20, { message: "Name must be at most 20 characters" }),
    species: z
      .string()
      .trim()
      .min(3, { message: "Species must be at least 3 characters" })
      .max(20, { message: "Species must be at most 20 characters" }),
    age: z.coerce
      .number()
      .min(0, { message: "Age must be at least 0" })
      .nullable(),
    description: z
      .string()
      .trim()
      .min(3, { message: "Description must be at least 3 characters" }),
    mainImage: z.string().url().nullable().optional(),
    gallery: z.array(z.string().url()).nullable().optional(),
  })
  .strip();
