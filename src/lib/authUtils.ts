import { type User } from "next-auth";

export function isAdmin(user: User) {
  return user.role === "admin" || user.role === "superadmin";
}

export function isSuperAdmin(user: User) {
  return user.role === "superadmin";
}
