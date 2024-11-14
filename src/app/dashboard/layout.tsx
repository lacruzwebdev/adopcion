import DashboardNavbar from "@/components/dashboard/navbar";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role !== "user") redirect("/");
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <header>
          <DashboardNavbar user={session.user} />
        </header>
        <main className="p-4 sm:px-6">
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
