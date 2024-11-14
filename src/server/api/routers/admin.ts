import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { z } from "zod";
import { type ServerActionResponse } from "@/types/types";
import { userSchema } from "@/lib/formSchemas";

export const adminRouter = createTRPCRouter({
  adminExists: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.users.findFirst({
      where: eq(users.role, "superadmin"),
    });
    return data !== undefined;
  }),
  getAdmins: protectedProcedure.query(async ({ ctx }) => {
    const admins = await ctx.db.query.users.findMany({
      where: eq(users.role, "admin"),
    });
    const res = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      role: admin.role,
    }));
    return res;
  }),
  getAdmin: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const admin = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });
      if (!admin) {
        return { type: "error", message: "Admin not found" };
      }
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        role: admin.role,
      };
    }),
  createAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        name: z.string().trim().min(3),
      }),
    )
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      const adminExists = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (adminExists) {
        return { type: "error", message: "Admin already exists" };
      }
      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        role: "admin",
      });
      return { type: "success", message: "Admin created successfully" };
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      const admin = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });
      if (!admin) {
        return { type: "error", message: "Admin not found" };
      }
      await ctx.db.delete(users).where(eq(users.id, input));
      return { type: "success", message: "Admin deleted successfully" };
    }),
  update: protectedProcedure
    .input(userSchema)
    .mutation<ServerActionResponse>(async ({ ctx, input }) => {
      const admin = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      if (!admin) {
        return { type: "error", message: "Admin not found" };
      }
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, input.id));
      return { type: "success", message: "Admin updated successfully" };
    }),
});
