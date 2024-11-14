import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="grid h-[90dvh] place-items-center">
      <Spinner />
    </div>
  );
}
