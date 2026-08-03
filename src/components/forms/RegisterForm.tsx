"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
//import { useForm } from "react-hook-form";
import { z } from "zod";

import { register as registerRequest } from "@/services/auth.service";
import { cn } from "@/lib/utils";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";

import type { PublicRegistrationRole, RegisterInput } from "@/types/auth";

const publicRoleSchema = z.enum(["TENANT", "LANDLORD"]);

const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required."),

    last_name: z.string().trim().min(1, "Last name is required."),

    email: z.email("Enter a valid email address.").trim().toLowerCase(),

    password: z.string().min(8, "Password must contain at least 8 characters."),

    confirmPassword: z.string().min(1, "Please confirm your password."),

    roles: z.array(publicRoleSchema).min(1, "Select at least one role."),

    tenant: z
      .object({
        occupation: z.string(),
        monthly_income: z.string(),
        emergency_contact: z.string(),
      })
      .optional(),

    landlord: z
      .object({
        company_name: z.string(),
        business_license: z.string(),
        tax_id: z.string(),
      })
      .optional(),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }

    if (values.roles.includes("TENANT")) {
      if (!values.tenant?.occupation.trim()) {
        context.addIssue({
          code: "custom",
          message: "Occupation is required.",
          path: ["tenant", "occupation"],
        });
      }

      const income = Number(values.tenant?.monthly_income);

      if (
        !values.tenant?.monthly_income.trim() ||
        !Number.isFinite(income) ||
        income <= 0
      ) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid monthly income.",
          path: ["tenant", "monthly_income"],
        });
      }

      if (!values.tenant?.emergency_contact.trim()) {
        context.addIssue({
          code: "custom",
          message: "Emergency contact is required.",
          path: ["tenant", "emergency_contact"],
        });
      }
    }

    if (values.roles.includes("LANDLORD")) {
      if (!values.landlord?.company_name.trim()) {
        context.addIssue({
          code: "custom",
          message: "Company name is required.",
          path: ["landlord", "company_name"],
        });
      }

      if (!values.landlord?.tax_id.trim()) {
        context.addIssue({
          code: "custom",
          message: "Tax ID is required.",
          path: ["landlord", "tax_id"],
        });
      }
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type ApiErrorResponse = {
  message?: string;
};

const registrationRoles: Array<{
  value: PublicRegistrationRole;
  title: string;
  description: string;
}> = [
  {
    value: "TENANT",
    title: "Tenant",
    description: "Rent or purchase properties through RentNest.",
  },
  {
    value: "LANDLORD",
    title: "Landlord",
    description: "List and manage properties on RentNest.",
  },
];

export default function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: [],
      tenant: {
        occupation: "",
        monthly_income: "",
        emergency_contact: "",
      },
      landlord: {
        company_name: "",
        business_license: "",
        tax_id: "",
      },
    },
  });

  //const selectedRoles = form.watch("roles");
  const selectedRoles =
    useWatch({
      control: form.control,
      name: "roles",
    }) ?? [];

  const isTenant = selectedRoles.includes("TENANT");
  const isLandlord = selectedRoles.includes("LANDLORD");

  function toggleRole(role: PublicRegistrationRole): void {
    const currentRoles = form.getValues("roles");

    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter((currentRole) => currentRole !== role)
      : [...currentRoles, role];

    form.setValue("roles", updatedRoles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setServerError(null);

    const payload: RegisterInput = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      roles: values.roles,
    };

    if (values.roles.includes("TENANT") && values.tenant) {
      payload.tenant = {
        occupation: values.tenant.occupation.trim(),
        monthly_income: Number(values.tenant.monthly_income),
        emergency_contact: values.tenant.emergency_contact.trim(),
      };
    }

    if (values.roles.includes("LANDLORD") && values.landlord) {
      payload.landlord = {
        company_name: values.landlord.company_name.trim(),
        business_license: values.landlord.business_license.trim() || undefined,
        tax_id: values.landlord.tax_id.trim(),
      };
    }

    try {
      await registerRequest(payload);

      router.replace("/login?registered=true");
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setServerError(
          error.response?.data?.message ?? "Unable to create your account.",
        );
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          Create your RentNest account
        </CardTitle>

        <CardDescription>
          Register as a tenant, landlord, or both.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="register-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                data-invalid={
                  form.formState.errors.first_name ? true : undefined
                }
              >
                <FieldLabel htmlFor="first_name">First name</FieldLabel>

                <Input
                  id="first_name"
                  autoComplete="given-name"
                  placeholder="First name"
                  aria-invalid={
                    form.formState.errors.first_name ? true : undefined
                  }
                  {...form.register("first_name")}
                />

                <FieldError errors={[form.formState.errors.first_name]} />
              </Field>

              <Field
                data-invalid={
                  form.formState.errors.last_name ? true : undefined
                }
              >
                <FieldLabel htmlFor="last_name">Last name</FieldLabel>

                <Input
                  id="last_name"
                  autoComplete="family-name"
                  placeholder="Last name"
                  aria-invalid={
                    form.formState.errors.last_name ? true : undefined
                  }
                  {...form.register("last_name")}
                />

                <FieldError errors={[form.formState.errors.last_name]} />
              </Field>
            </div>

            <Field
              data-invalid={form.formState.errors.email ? true : undefined}
            >
              <FieldLabel htmlFor="register-email">Email address</FieldLabel>

              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={form.formState.errors.email ? true : undefined}
                {...form.register("email")}
              />

              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                data-invalid={form.formState.errors.password ? true : undefined}
              >
                <FieldLabel htmlFor="register-password">Password</FieldLabel>

                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={
                    form.formState.errors.password ? true : undefined
                  }
                  {...form.register("password")}
                />

                <FieldError errors={[form.formState.errors.password]} />
              </Field>

              <Field
                data-invalid={
                  form.formState.errors.confirmPassword ? true : undefined
                }
              >
                <FieldLabel htmlFor="confirm-password">
                  Confirm password
                </FieldLabel>

                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  aria-invalid={
                    form.formState.errors.confirmPassword ? true : undefined
                  }
                  {...form.register("confirmPassword")}
                />

                <FieldError errors={[form.formState.errors.confirmPassword]} />
              </Field>
            </div>

            <Field
              data-invalid={form.formState.errors.roles ? true : undefined}
            >
              <FieldLabel>Choose your roles</FieldLabel>

              <FieldDescription>
                You may register as a tenant, landlord, or both.
              </FieldDescription>

              <div className="grid gap-4 sm:grid-cols-2">
                {registrationRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role.value);

                  return (
                    <button
                      key={role.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleRole(role.value)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{role.title}</p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground",
                          )}
                          aria-hidden="true"
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <FieldError errors={[form.formState.errors.roles]} />
            </Field>

            {isTenant && (
              <section className="space-y-4 rounded-lg border p-5">
                <div>
                  <h2 className="font-heading text-lg font-semibold">
                    Tenant information
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Tell us a little about your tenant profile.
                  </p>
                </div>

                <Field
                  data-invalid={
                    form.formState.errors.tenant?.occupation ? true : undefined
                  }
                >
                  <FieldLabel htmlFor="occupation">Occupation</FieldLabel>

                  <Input
                    id="occupation"
                    placeholder="For example, teacher"
                    aria-invalid={
                      form.formState.errors.tenant?.occupation
                        ? true
                        : undefined
                    }
                    {...form.register("tenant.occupation")}
                  />

                  <FieldError
                    errors={[form.formState.errors.tenant?.occupation]}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    data-invalid={
                      form.formState.errors.tenant?.monthly_income
                        ? true
                        : undefined
                    }
                  >
                    <FieldLabel htmlFor="monthly_income">
                      Monthly income
                    </FieldLabel>

                    <Input
                      id="monthly_income"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="5000"
                      aria-invalid={
                        form.formState.errors.tenant?.monthly_income
                          ? true
                          : undefined
                      }
                      {...form.register("tenant.monthly_income")}
                    />

                    <FieldError
                      errors={[form.formState.errors.tenant?.monthly_income]}
                    />
                  </Field>

                  <Field
                    data-invalid={
                      form.formState.errors.tenant?.emergency_contact
                        ? true
                        : undefined
                    }
                  >
                    <FieldLabel htmlFor="emergency_contact">
                      Emergency contact
                    </FieldLabel>

                    <Input
                      id="emergency_contact"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone number"
                      aria-invalid={
                        form.formState.errors.tenant?.emergency_contact
                          ? true
                          : undefined
                      }
                      {...form.register("tenant.emergency_contact")}
                    />

                    <FieldError
                      errors={[form.formState.errors.tenant?.emergency_contact]}
                    />
                  </Field>
                </div>
              </section>
            )}

            {isLandlord && (
              <section className="space-y-4 rounded-lg border p-5">
                <div>
                  <h2 className="font-heading text-lg font-semibold">
                    Landlord information
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Provide the details associated with your landlord profile.
                  </p>
                </div>

                <Field
                  data-invalid={
                    form.formState.errors.landlord?.company_name
                      ? true
                      : undefined
                  }
                >
                  <FieldLabel htmlFor="company_name">Company name</FieldLabel>

                  <Input
                    id="company_name"
                    autoComplete="organization"
                    placeholder="Company or business name"
                    aria-invalid={
                      form.formState.errors.landlord?.company_name
                        ? true
                        : undefined
                    }
                    {...form.register("landlord.company_name")}
                  />

                  <FieldError
                    errors={[form.formState.errors.landlord?.company_name]}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="business_license">
                      Business license
                    </FieldLabel>

                    <Input
                      id="business_license"
                      placeholder="Optional"
                      {...form.register("landlord.business_license")}
                    />
                  </Field>

                  <Field
                    data-invalid={
                      form.formState.errors.landlord?.tax_id ? true : undefined
                    }
                  >
                    <FieldLabel htmlFor="tax_id">Tax ID</FieldLabel>

                    <Input
                      id="tax_id"
                      placeholder="Tax identification number"
                      aria-invalid={
                        form.formState.errors.landlord?.tax_id
                          ? true
                          : undefined
                      }
                      {...form.register("landlord.tax_id")}
                    />

                    <FieldError
                      errors={[form.formState.errors.landlord?.tax_id]}
                    />
                  </Field>
                </div>
              </section>
            )}

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
          form="register-form"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Creating account..."
            : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
