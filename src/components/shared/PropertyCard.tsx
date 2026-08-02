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
  const hasPropertyImage = property.property_images.length > 0;

  const imageSource = hasPropertyImage
    ? property.property_images[0]
    : PLACEHOLDER_IMAGE;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-52 w-full">
        <Image
          src={imageSource}
          alt={
            hasPropertyImage
              ? `Property at ${property.address}`
              : "Placeholder property image"
          }
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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
        <Button asChild className="w-full">
          <Link href={`/properties/${property.property_id}`}>Show details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
