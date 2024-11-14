import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/admin/AdminColumn";
import { isAdmin, isSuperAdmin } from "@/lib/authUtils";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import CreateUserDialog from "@/components/admin/create-user-dialog";
import { getUsers } from "@/server/actions/userActions";

export default async function AdminUsersPage() {
  const session = await auth();
  const isAuthorized =
    session && (isAdmin(session.user) || isSuperAdmin(session.user));
  if (!session || !isAuthorized) {
    redirect("/");
  }

  const users = await getUsers();
  // const users = await api.user.getUsers();
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          User Accounts
        </h1>
      </div>
      {isSuperAdmin(session.user) && (
        <div className="mb-4 flex justify-end">
          <CreateUserDialog role="user" />
        </div>
      )}
      {users.data ? (
        <DataTable columns={columns} data={users.data} />
      ) : (
        <p>No results</p>
      )}
    </div>
  );
}
