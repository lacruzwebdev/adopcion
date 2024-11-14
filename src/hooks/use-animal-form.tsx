import { animalSchema } from "@/lib/formSchemas";
import {
  createAnimal,
  editAnimal,
  getAnimal,
} from "@/server/actions/animalActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useAnimalForm(closeOnSubmit: () => void, id?: string) {
  const serverAction = id ? editAnimal : createAnimal;
  const [state, formAction, isPending] = useActionState(serverAction, {
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      id: id ?? "",
      name: "",
      species: "",
      age: "",
      description: "",
    },
  });

  useEffect(() => {
    if (id) {
      async function fetchAnimal(id: string) {
        setIsLoading(true);
        const animal = await getAnimal(id);
        if (animal.data) {
          form.reset({
            name: animal.data.name ?? "",
            species: animal.data.species ?? "",
          });
        }
        setIsLoading(false);
      }
      fetchAnimal(id).catch((err) => console.log(err));
    }
  }, [form, id]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      closeOnSubmit();
    }
  }, [state, closeOnSubmit]);

  const handleFormSubmit = (values: {
    name: string;
    species: string;
    age: number;
    description: string;
  }) => {
    startTransition(() => {
      formAction({ ...values, id: id ?? "" });
    });
  };

  return { form, formAction, handleFormSubmit, state, isLoading, isPending };
}
