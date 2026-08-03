"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateProperty } from "@/hooks/useLandlordProperty";

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

import type { CreatePropertyInput } from "@/types/property";

const propertySchema = z.object({
  address: z.string().trim().min(5, "Enter a complete property address."),

  asking_price: z.string().trim().min(1, "Asking price is required."),

  category: z.enum(["RESIDENTIAL", "COMMERCIAL"]),

  type: z.enum([
    "SINGLE_FAMILY_HOME",
    "TOWNHOUSE",
    "APARTMENT_COMPLEX",
    "OFFICE_SPACE",
    "STORAGE_SPACE",
  ]),

  bedrooms: z.string(),
  bathrooms: z.string(),
  square_feet: z.string(),
  year_built: z.string(),
  parking_spaces: z.string(),

  pet_allowed: z.boolean(),

  property_images: z.string(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

type ApiErrorResponse = {
  message?: string;
};

function parseRequiredNonNegativeNumber(
  value: string,
  fieldName: string,
): number {
  const numberValue = Number(value);

  if (value.trim() === "" || !Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`${fieldName} must be zero or greater.`);
  }

  return numberValue;
}

export default function PropertyForm() {
  const router = useRouter();
  const createPropertyMutation = useCreateProperty();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      asking_price: "",
      category: "RESIDENTIAL",
      type: "SINGLE_FAMILY_HOME",
      bedrooms: "0",
      bathrooms: "0",
      square_feet: "",
      year_built: "",
      parking_spaces: "0",
      pet_allowed: false,
      property_images: "",
    },
  });

  async function onSubmit(values: PropertyFormValues): Promise<void> {
    setServerError(null);

    try {
      const askingPrice = parseRequiredNonNegativeNumber(
        values.asking_price,
        "Asking price",
      );

      const bedrooms = parseRequiredNonNegativeNumber(
        values.bedrooms,
        "Bedrooms",
      );

      const bathrooms = parseRequiredNonNegativeNumber(
        values.bathrooms,
        "Bathrooms",
      );

      const squareFeet = parseRequiredNonNegativeNumber(
        values.square_feet,
        "Square feet",
      );

      const parkingSpaces = parseRequiredNonNegativeNumber(
        values.parking_spaces,
        "Parking spaces",
      );

      const yearBuilt =
        values.year_built.trim() === "" ? undefined : Number(values.year_built);

      if (
        yearBuilt !== undefined &&
        (!Number.isInteger(yearBuilt) ||
          yearBuilt < 1800 ||
          yearBuilt > new Date().getFullYear())
      ) {
        throw new Error("Enter a valid year built.");
      }

      const imageUrls = values.property_images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const payload: CreatePropertyInput = {
        address: values.address.trim(),
        asking_price: askingPrice,
        category: values.category,
        type: values.type,
        features: {
          bedrooms,
          bathrooms,
          square_feet: squareFeet,
          year_built: yearBuilt,
          parking_spaces: parkingSpaces,
          pet_allowed: values.pet_allowed,
        },
        property_images: imageUrls,
      };

      await createPropertyMutation.mutateAsync(payload);

      router.replace("/dashboard/landlord/properties");
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setServerError(
          error.response?.data?.message ?? "Unable to create the property.",
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
        <CardTitle className="font-heading text-2xl">Add a property</CardTitle>

        <CardDescription>
          New properties are submitted with pending approval status.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="property-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup>
            <Field
              data-invalid={form.formState.errors.address ? true : undefined}
            >
              <FieldLabel htmlFor="address">Property address</FieldLabel>

              <Input
                id="address"
                placeholder="123 Main Street, Thousand Oaks, CA"
                aria-invalid={form.formState.errors.address ? true : undefined}
                {...form.register("address")}
              />

              <FieldError errors={[form.formState.errors.address]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>

                <select
                  id="category"
                  className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                  {...form.register("category")}
                >
                  <option value="RESIDENTIAL">Residential</option>

                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="type">Property type</FieldLabel>

                <select
                  id="type"
                  className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                  {...form.register("type")}
                >
                  <option value="SINGLE_FAMILY_HOME">Single-family home</option>

                  <option value="TOWNHOUSE">Townhouse</option>

                  <option value="APARTMENT_COMPLEX">Apartment complex</option>

                  <option value="OFFICE_SPACE">Office space</option>

                  <option value="STORAGE_SPACE">Storage space</option>
                </select>
              </Field>
            </div>

            <Field
              data-invalid={
                form.formState.errors.asking_price ? true : undefined
              }
            >
              <FieldLabel htmlFor="asking_price">Asking price</FieldLabel>

              <Input
                id="asking_price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="2500"
                aria-invalid={
                  form.formState.errors.asking_price ? true : undefined
                }
                {...form.register("asking_price")}
              />

              <FieldError errors={[form.formState.errors.asking_price]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>

                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register("bedrooms")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>

                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="1"
                  {...form.register("bathrooms")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="square_feet">Square feet</FieldLabel>

                <Input
                  id="square_feet"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1800"
                  {...form.register("square_feet")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="year_built">Year built</FieldLabel>

                <Input
                  id="year_built"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  step="1"
                  placeholder="2018"
                  {...form.register("year_built")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="parking_spaces">Parking spaces</FieldLabel>

                <Input
                  id="parking_spaces"
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
                  id="pet_allowed"
                  type="checkbox"
                  className="size-4"
                  {...form.register("pet_allowed")}
                />

                <FieldLabel htmlFor="pet_allowed">Pets are allowed</FieldLabel>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="property_images">
                Property image URLs
              </FieldLabel>

              <textarea
                id="property_images"
                rows={5}
                placeholder={
                  "Enter one image URL per line\nhttps://example.com/image-1.jpg"
                }
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...form.register("property_images")}
              />

              <FieldDescription>
                Enter one image URL per line. Images are optional.
              </FieldDescription>
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
          onClick={() => router.push("/dashboard/landlord/properties")}
          disabled={createPropertyMutation.isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="property-form"
          disabled={createPropertyMutation.isPending}
        >
          {createPropertyMutation.isPending
            ? "Creating property..."
            : "Create property"}
        </Button>
      </CardFooter>
    </Card>
  );
}
