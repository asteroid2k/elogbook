import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { updateSchema } from "@/app/api/schema/elogs.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { client } from "@/utils/fetch-client";
import toast from "react-hot-toast";
import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";
import { FetchError } from "ofetch";

type FormProps = {
  elogId: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => Promise<void>;
};
type ElogData = z.infer<typeof updateSchema>;

export function ElogFormDialog({ elogId, open, setOpen, refetch }: FormProps) {
  const [loading, setLoading] = useState(false);
  const action = elogId ? "Update" : "Add";
  const desc = elogId ? "Make changes to your e-log" : "";

  const form = useForm<ElogData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: "",
      content: "",
      imageKey: "",
      published: false,
      reviewed: false,
    },
  });

  useEffect(() => {
    if (!elogId?.length) return;
    console.log(elogId);

    setLoading(true);
    client(`api/elogs/${elogId}`)
      .then((resp) => {
        form.reset(resp);
      })
      .catch((e) => toast.error("Could not fetch e-log"))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function submitForm(values: ElogData) {
    try {
      const resp = await client(`api/elogs${elogId ? "/" + elogId : ""}`, {
        method: elogId ? "PUT" : "POST",
        body: values,
      });
      toast(`E-log has been ${elogId ? "updated" : "posted"}`);
      refetch().then();
      setOpen(false);
    } catch (error) {
      if (error instanceof FetchError) {
        const err = error.data;
        toast.error(err?.message);
        return;
      }
      toast.error("Could not post e-log");
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button
          className="text-lg py-5 "
          size="lg"
          onClick={() => setOpen(!open)}
        >
          <PlusCircledIcon className="mr-2 w-5 h-5" />
          Add new e-log
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-md">
        {loading || form.formState.isSubmitting ? (
          <div className="h-full grid place-items-center">
            <ReloadIcon className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-2"
            >
              <DialogHeader className="mb-4">
                <DialogTitle>{action} e-log</DialogTitle>
                <DialogDescription>{desc} </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="!mt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full min-w-[150px] mx-auto"
                >
                  {action} e-log
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
