import CreateAnimalDialog from "@/components/dashboard/create-animal-dialog";

export default function DashboardAnimalsPage() {
  return (
    <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Your Animals
        </h1>
      </div>
      <div className="mb-4 flex justify-end">
        <CreateAnimalDialog role="user" />
      </div>
    </div>
  );
}
