import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Property } from "@/types/property";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  return (
    <Card>
      <div className="relative h-48 w-full">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600">{property.location}</p>

        <p className="mt-2 font-semibold">${property.price}/month</p>
      </CardContent>
    </Card>
  );
}
