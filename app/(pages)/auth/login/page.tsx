"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/utils/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LogIn() {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Rade",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <Link
        href="/"
        className="absolute flex text-white items-center gap-1 top-8 left-8 text-sm underline"
      >
        <ArrowLeft width={16} height={16} />
        Go back
      </Link>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Restaurant Admin</CardTitle>
          <CardDescription>Sign in to manage your restaurant</CardDescription>
          <Separator className="mt-3" />
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@restaurant.com"
                    {...form.register("email")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal" className="justify-end gap-2">
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>

              <Button size="lg" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Field>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
