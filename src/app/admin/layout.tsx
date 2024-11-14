import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "admin" && session?.user.role !== "superadmin") {
    redirect("/");
  }
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header>
          <AdminNavbar user={session.user} />
        </header>
        <main className="p-4 sm:px-6">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
