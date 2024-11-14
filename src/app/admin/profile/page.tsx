import UploadAvatar from "@/components/admin/profile/uploadAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isAdmin, isSuperAdmin } from "@/lib/authUtils";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session || (!isAdmin(session.user) && !isSuperAdmin(session.user))) {
    redirect("/");
  }
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Account Settings
        </h1>
      </div>
      <div className="mb-8 rounded-xl bg-white shadow-sm">
        <div className="flex flex-col md:-mr-px md:flex-row">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              {session.user.image && <AvatarImage src={session.user.image} />}
              <AvatarFallback>
                {session.user.name?.substring(0, 2).toUpperCase() ?? "US"}
              </AvatarFallback>
            </Avatar>
            <UploadAvatar id={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
