"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-9xl mx-auto grid w-full justify-center px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
        Something went wrong!
      </h1>
      <Button className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
