"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest } from "@/app/api/auth/login/route";
import { FetchError } from "ofetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { client } from "@/utils/fetch-client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUserSchema } from "@/app/api/users/schema";
import { z } from "zod";

type Register = z.infer<typeof createUserSchema>;

export default function Register() {
  const router = useRouter();
  const form = useForm<Register>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  async function onRegister(data: LoginRequest) {
    try {
      const res = await client("/api/users", {
        method: "POST",
        body: data,
      });
      toast("Account created");
      router.push("/");
    } catch (error) {
      if (error instanceof FetchError) {
        const err = error.data;
        toast.error(err?.message);
        if (error.status === 422) {
          err?.errors.forEach((errobj: any) => {
            form.setError(errobj?.field, errobj?.message);
          });
        }
        return;
      }
      toast.error("A problem occurred");
    }
  }
  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-[280px] gap-3 h-fit"
        onSubmit={form.handleSubmit(onRegister)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-4"
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
