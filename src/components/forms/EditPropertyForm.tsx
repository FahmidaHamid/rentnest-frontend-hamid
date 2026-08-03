"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUpdateProperty } from "@/hooks/useLandlordProperty";

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

import type { LandlordProperty, UpdatePropertyInput } from "@/types/property";

const editPropertySchema = z.object({
  address: z.string().trim().min(5, "Enter a complete property address."),

  asking_price: z.string().trim().min(1, "Asking price is required."),

  bedrooms: z.string(),
  bathrooms: z.string(),
  square_feet: z.string(),
  year_built: z.string(),
  parking_spaces: z.string(),
  pet_allowed: z.boolean(),
});

type EditPropertyFormValues = z.infer<typeof editPropertySchema>;

type ApiErrorResponse = {
  message?: string;
};

type EditPropertyFormProps = {
  property: LandlordProperty;
};

function parseNonNegativeNumber(value: string, fieldName: string): number {
  const parsedValue = Number(value);

  if (value.trim() === "" || !Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new Error(`${fieldName} must be zero or greater.`);
  }

  return parsedValue;
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateProperty();

  const [serverError, setServerError] = useState<string | null>(null);

  const features = property.features;

  const form = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      address: property.address,
      asking_price: String(property.asking_price),
      bedrooms: String(features?.bedrooms ?? 0),
      bathrooms: String(features?.bathrooms ?? 0),
      square_feet: String(features?.square_feet ?? 0),
      year_built:
        features?.year_built == null ? "" : String(features.year_built),
      parking_spaces: String(features?.parking_spaces ?? 0),
      pet_allowed: features?.pet_allowed ?? false,
    },
  });

  async function onSubmit(values: EditPropertyFormValues): Promise<void> {
    setServerError(null);

    try {
      const yearBuilt =
        values.year_built.trim() === "" ? null : Number(values.year_built);

      if (
        yearBuilt !== null &&
        (!Number.isInteger(yearBuilt) ||
          yearBuilt < 1800 ||
          yearBuilt > new Date().getFullYear())
      ) {
        throw new Error("Enter a valid year built.");
      }

      const payload: UpdatePropertyInput = {
        address: values.address.trim(),

        asking_price: parseNonNegativeNumber(
          values.asking_price,
          "Asking price",
        ),

        features: {
          bedrooms: parseNonNegativeNumber(values.bedrooms, "Bedrooms"),

          bathrooms: parseNonNegativeNumber(values.bathrooms, "Bathrooms"),

          square_feet: parseNonNegativeNumber(
            values.square_feet,
            "Square feet",
          ),

          year_built: yearBuilt,

          parking_spaces: parseNonNegativeNumber(
            values.parking_spaces,
            "Parking spaces",
          ),

          pet_allowed: values.pet_allowed,
        },
      };

      await updateMutation.mutateAsync({
        propertyId: property.property_id,
        payload,
      });

      router.replace(`/dashboard/landlord/properties/${property.property_id}`);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setServerError(
          error.response?.data?.message ?? "Unable to update the property.",
        );
        return;
      }

      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Edit property</CardTitle>

        <CardDescription>
          Update the property information below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="edit-property-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <Field
              data-invalid={form.formState.errors.address ? true : undefined}
            >
              <FieldLabel htmlFor="edit-address">Property address</FieldLabel>

              <Input
                id="edit-address"
                aria-invalid={form.formState.errors.address ? true : undefined}
                {...form.register("address")}
              />

              <FieldError errors={[form.formState.errors.address]} />
            </Field>

            <Field
              data-invalid={
                form.formState.errors.asking_price ? true : undefined
              }
            >
              <FieldLabel htmlFor="edit-price">Asking price</FieldLabel>

              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                aria-invalid={
                  form.formState.errors.asking_price ? true : undefined
                }
                {...form.register("asking_price")}
              />

              <FieldError errors={[form.formState.errors.asking_price]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="edit-bedrooms">Bedrooms</FieldLabel>

                <Input
                  id="edit-bedrooms"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register("bedrooms")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-bathrooms">Bathrooms</FieldLabel>

                <Input
                  id="edit-bathrooms"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register("bathrooms")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-square-feet">Square feet</FieldLabel>

                <Input
                  id="edit-square-feet"
                  type="number"
                  min="0"
                  step="0.01"
                  {...form.register("square_feet")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="edit-year-built">Year built</FieldLabel>

                <Input
                  id="edit-year-built"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  step="1"
                  {...form.register("year_built")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-parking">Parking spaces</FieldLabel>

                <Input
                  id="edit-parking"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register("parking_spaces")}
                />
              </Field>
            </div>

            <Field>
              <div className="flex items-center gap-3">
                <input
                  id="edit-pet-allowed"
                  type="checkbox"
                  className="size-4"
                  {...form.register("pet_allowed")}
                />

                <FieldLabel htmlFor="edit-pet-allowed">
                  Pets are allowed
                </FieldLabel>
              </div>
            </Field>

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={updateMutation.isPending}
          onClick={() =>
            router.push(
              `/dashboard/landlord/properties/${property.property_id}`,
            )
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="edit-property-form"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving changes..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
