import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { User } from "react-feather";
import { auth } from "@/server/auth";
import { isSuperAdmin } from "@/lib/authUtils";

export default async function AdminSidebar() {
  const user = (await auth())?.user;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin">Logo</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && isSuperAdmin(user) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/admins">
                      <User />
                      Admins
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/users">
                    <User />
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
