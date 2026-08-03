import Image from "next/image";

import type { Property } from "@/types/property";
import PropertyRequestButton from "@/components/shared/PropertyRequestButton";

type PropertyDetailsProps = {
  property: Property;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa";

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

export default function PropertyDetails({ property }: PropertyDetailsProps) {
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
    <div className="mx-auto max-w-6xl p-8">
      <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
        <Image
          src={imageSource}
          alt={
            hasPropertyImage
              ? property.address
              : "Placeholder image for property"
          }
          fill
          sizes="100vw"
          className="object-cover"
        />

        {!hasPropertyImage && (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/75 px-3 py-1 text-xs font-medium text-white">
            Placeholder image
          </span>
        )}
      </div>

      <div className="mt-8">
        <h1 className="text-4xl font-bold">{property.address}</h1>

        <p className="mt-3 text-3xl font-semibold">
          ${property.asking_price.toLocaleString()}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 rounded-lg border p-6 md:grid-cols-3">
        <div>
          <p className="font-semibold">Bedrooms</p>
          <p>{property.features?.bedrooms ?? "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Bathrooms</p>
          <p>{property.features?.bathrooms ?? "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Square Feet</p>
          <p>{property.features?.square_feet ?? "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Parking</p>
          <p>{property.features?.parking_spaces ?? "-"}</p>
        </div>

        <div>
          <p className="font-semibold">Pets</p>
          <p>{property.features?.pet_allowed ? "Allowed" : "Not Allowed"}</p>
        </div>

        <div>
          <p className="font-semibold">Status</p>
          <p>{property.status}</p>
        </div>
        <PropertyRequestButton
          propertyId={property.property_id}
          propertyStatus={property.status}
        />
      </div>
    </div>
  );
}
