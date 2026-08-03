import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandlordDashboardPage() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">
            Landlord Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your properties and review tenant or buyer requests.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>

              <CardDescription>
                View and manage the properties you have listed.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button render={<Link href="/dashboard/landlord/properties" />}>
                View properties
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Property</CardTitle>

              <CardDescription>
                Create a new rental or sale property listing.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                render={<Link href="/dashboard/landlord/properties/new" />}
              >
                Add property
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
