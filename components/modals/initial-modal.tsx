"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[500px] inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex items-center justify-center text-center">
              <Controller
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FileUpload
                    endpoint="serverImage"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    htmlFor="server-name"
                  >
                    Server name
                  </FieldLabel>
                  <Input
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 dark:bg-zinc-300/50!"
                    placeholder="Enter server name"
                    {...field}
                    id="server-name"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
