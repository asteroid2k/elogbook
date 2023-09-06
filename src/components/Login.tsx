"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchError, ofetch } from "ofetch";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { saveLocalUser } from "@/utils/helpers";
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
import { LoginRequest, loginSchema } from "@/app/api/auth/login/schema";

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onLogin(data: LoginRequest) {
    try {
      const res = await client("/api/auth/login", {
        method: "POST",
        body: data,
      });

      saveLocalUser(res?.user);
      Cookies.set("elogbook_token", res?.token, {
        secure: true,
        sameSite: "Lax",
      });
      router.push("/elogs");
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
        onSubmit={form.handleSubmit(onLogin)}
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
