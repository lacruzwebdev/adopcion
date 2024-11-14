import EditProfileForm from "@/components/dashboard/edit-profile-form";
import { getProfile } from "@/server/actions/userActions";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  //const profile = await api.user.getUserProfile(session.user.id);
  const profile = await getProfile(session.user.id);
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Your Profile
        </h1>
        {profile.data && <EditProfileForm profile={profile.data} />}
      </div>
    </div>
  );
}
