import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { profiles, users } from "@/server/db/schema";
import { type ServerActionResponse } from "@/types/types";
import { profileSchema } from "@/lib/formSchemas";

export const userRouter = createTRPCRouter({
  uploadUserAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
      });
      if (!user) return { type: "error", message: "User not found" };
      const res = await ctx.db
        .update(users)
        .set({
          image: input.url,
        })
        .where(eq(users.id, input.userId));
    }),
  getUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });
      if (!user) {
        return { type: "error", message: "User not found" };
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const usersData = await ctx.db.query.users.findMany({
      where: eq(users.role, "user"),
    });
    return usersData.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    }));
  }),
  getUserProfile: protectedProcedure
    .input(z.string())
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
      if (!user) {
        return { error: "User not found" };
      }
      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.userId, user.id),
      });
      if (!profile) {
        return { error: "User not found" };
      }
      return { error: undefined, data: profile };
    }),
  updateUserProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!userExists) {
        return { error: "User not found" };
      }

      const parsedData = profileSchema.safeParse(input);
      if (!parsedData.success) return { message: "Invalid form data" };

      await ctx.db
        .update(profiles)
        .set(parsedData.data)
        .where(eq(profiles.userId, userExists.id));
      return { message: "Profile updated successfully" };
    }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        name: z.string().trim().min(3),
        role: z.enum(["admin", "user"]),
      }),
    )
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      if (input.role === "admin" && ctx.session.user.role !== "superadmin") {
        return { type: "error", message: "Unauthorized" };
      }
      const userExists = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (userExists) {
        return { type: "error", message: "User already exists" };
      }
      const newUser = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          role: input.role,
        })
        .returning({ id: users.id });

      if (newUser[0]) {
        await ctx.db.insert(profiles).values({
          userId: newUser[0].id,
        });
      }
      return { type: "success", message: "User created successfully" };
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      if (
        ctx.session.user.role !== "superadmin" &&
        ctx.session.user.role !== "admin"
      ) {
        return { type: "error", message: "Unauthorized" };
      }
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });
      if (!user) {
        return { type: "error", message: "User not found" };
      }
      await ctx.db.delete(users).where(eq(users.id, input));
      return { type: "success", message: "User deleted successfully" };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
        email: z.string().trim().email(),
        name: z.string().trim().min(3),
      }),
    )
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      if (!user) {
        return { type: "error", message: "User not found" };
      }
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, input.id));
      return { type: "success", message: "User updated successfully" };
    }),
});
