import type { z } from "zod";
import type { profileSchema } from "@/lib/formSchemas";

type ProfileFields = z.infer<typeof profileSchema>;
export const profileLabels: Record<keyof ProfileFields, string> = {
  title: "Your title",
  bio: "Your bio",
  location: "Your location",
  website: "Your website",
  twitter: "Your Twitter",
  instagram: "Your Instagram",
  description: "Your description",
};
