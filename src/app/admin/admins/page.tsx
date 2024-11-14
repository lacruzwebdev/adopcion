import { columns } from "@/components/admin/AdminColumn";
import CreateUserDialog from "@/components/admin/create-user-dialog";
import { DataTable } from "@/components/ui/data-table";
import { isAdmin, isSuperAdmin } from "@/lib/authUtils";
import { getAdmins } from "@/server/actions/adminActions";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminsPage() {
  const session = await auth();
  if (!session || (!isAdmin(session.user) && !isSuperAdmin(session.user))) {
    redirect("/");
  }
  const { data } = await getAdmins();

  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Admin Accounts
        </h1>
      </div>
      {isSuperAdmin(session.user) && (
        <div className="mb-4 flex justify-end">
          <CreateUserDialog role="admin" />
        </div>
      )}
      {data ? <DataTable columns={columns} data={data} /> : <p>No results</p>}
    </div>
  );
}
