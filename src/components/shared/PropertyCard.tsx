import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa";

/*
 * Next.js Image only accepts remote hosts configured in next.config.ts.
 * Add future providers here and in next.config.ts.
 */
const ALLOWED_IMAGE_HOSTS = new Set(["images.unsplash.com"]);

function isUsableImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const propertyImages = Array.isArray(property.property_images)
    ? property.property_images
    : [];

  const firstValidImage = propertyImages.find((image) =>
    isUsableImageUrl(image?.image_url),
  );

  const hasPropertyImage = Boolean(firstValidImage);

  const imageSource = firstValidImage
    ? firstValidImage.image_url.trim()
    : PLACEHOLDER_IMAGE;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-52 w-full">
        <Image
          src={imageSource}
          alt={
            hasPropertyImage
              ? `Property at ${property.address}`
              : "Placeholder image for property listing"
          }
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        {!hasPropertyImage && (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/75 px-3 py-1 text-xs font-medium text-white">
            Placeholder image
          </span>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">
          {property.address}
        </CardTitle>

        <p className="text-2xl font-bold">
          {formatPrice(property.asking_price)}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {formatLabel(property.type)}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {formatLabel(property.status)}
          </span>
        </div>

        {property.features ? (
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="font-semibold">{property.features.bedrooms}</p>
              <p className="text-gray-500">Bedrooms</p>
            </div>

            <div>
              <p className="font-semibold">{property.features.bathrooms}</p>
              <p className="text-gray-500">Bathrooms</p>
            </div>

            <div>
              <p className="font-semibold">
                {property.features.square_feet.toLocaleString()}
              </p>
              <p className="text-gray-500">Sq. ft.</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Property features are not available.
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/properties/${property.property_id}`} className="w-full">
          <Button className="w-full">Show details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
