"use client";

import Link from "next/link";
//import { useRouter } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(3, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type ApiErrorResponse = {
  message?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const registeredSuccessfully = searchParams.get("registered") === "true";
  const redirectPath = searchParams.get("redirect") ?? "/dashboard";
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      await login(values);

      const safeRedirectPath = redirectPath.startsWith("/")
        ? redirectPath
        : "/dashboard";

      router.replace(safeRedirectPath);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setServerError(
          error.response?.data?.message ??
            "Unable to log in. Please try again.",
        );
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>

        <CardDescription>
          Sign in to access your RentNest account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {registeredSuccessfully && (
          <p
            role="status"
            className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Your account was created successfully. You can now log in.
          </p>
        )}
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field
              data-invalid={form.formState.errors.email ? true : undefined}
            >
              <FieldLabel htmlFor="email">Email address</FieldLabel>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={form.formState.errors.email ? true : undefined}
                {...form.register("email")}
              />

              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field
              data-invalid={form.formState.errors.password ? true : undefined}
            >
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={form.formState.errors.password ? true : undefined}
                {...form.register("password")}
              />

              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
