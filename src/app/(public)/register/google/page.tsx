"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { registerGoogleUser } from "@/services/auth.service";
import { saveAccessToken } from "@/lib/auth-storage";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  GoogleRegisterInput,
  GoogleUserPreview,
  PublicRegistrationRole,
} from "@/types/auth";

type StoredGoogleRegistration = {
  registrationToken: string;
  googleUser: GoogleUserPreview;
};

type ApiErrorResponse = {
  message?: string;
};

function subscribeToGoogleRegistration() {
  return () => {};
}

function getGoogleRegistrationSnapshot() {
  return sessionStorage.getItem("googleRegistration");
}

function getServerGoogleRegistrationSnapshot() {
  return null;
}

export default function GoogleRegisterPage() {
  const router = useRouter();

  /*
   * Read the temporary Google registration data that was saved
   * by GoogleLoginButton before navigating to this page.
   */
  const storedGoogleRegistration = useSyncExternalStore(
    subscribeToGoogleRegistration,
    getGoogleRegistrationSnapshot,
    getServerGoogleRegistrationSnapshot,
  );

  const googleData = useMemo<StoredGoogleRegistration | null>(() => {
    if (!storedGoogleRegistration) {
      return null;
    }

    try {
      const parsed = JSON.parse(
        storedGoogleRegistration,
      ) as StoredGoogleRegistration;

      if (!parsed.registrationToken || !parsed.googleUser?.email) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, [storedGoogleRegistration]);

  /*
   * RentNest registration fields
   */
  const [roles, setRoles] = useState<PublicRegistrationRole[]>(["TENANT"]);
  // Tenant fields
  const [occupation, setOccupation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Landlord fields
  const [companyName, setCompanyName] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [taxId, setTaxId] = useState("");

  const [serverError, setServerError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!googleData) {
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    try {
      const payload: GoogleRegisterInput = {
  registrationToken: googleData.registrationToken,
  roles,

  ...(roles.includes("TENANT") && {
    tenant: {
      occupation,
      monthly_income: Number(monthlyIncome),
      emergency_contact: emergencyContact,
    },
  }),

  ...(roles.includes("LANDLORD") && {
    landlord: {
      company_name: companyName,
      business_license:
        businessLicense || undefined,
      tax_id: taxId,
    },
  }),
};

const response = await registerGoogleUser(payload);

      /*
       * Backend has now created the RentNest account
       * and returned a normal RentNest JWT.
       */
      saveAccessToken(response.accessToken);

      /*
       * The temporary Google registration data is no
       * longer needed.
       */
      sessionStorage.removeItem("googleRegistration");

      router.replace("/dashboard");
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setServerError(
          error.response?.data?.message ?? "Unable to complete registration.",
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  function toggleRole(role: PublicRegistrationRole) {
    setRoles((currentRoles) => {
      if (currentRoles.includes(role)) {
        // Require at least one role
        if (currentRoles.length === 1) {
          return currentRoles;
        }

        return currentRoles.filter((currentRole) => currentRole !== role);
      }

      return [...currentRoles, role];
    });
  }
  /*
   * The user should only reach this page after successfully
   * authenticating with Google.
   */
  if (!googleData) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Google registration unavailable</CardTitle>

            <CardDescription>
              Your Google registration session is missing or has expired. Please
              sign in with Google again.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button className="w-full" onClick={() => router.replace("/login")}>
              Return to login
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Complete your RentNest account
          </CardTitle>

          <CardDescription>
            Google verified your identity. Complete your RentNest profile below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="google-register-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Google-verified identity */}
            <div className="space-y-4 rounded-lg border p-4">
              <p className="text-sm font-medium">Google account</p>

              <div className="space-y-2">
                <Label htmlFor="google-first-name">First name</Label>

                <Input
                  id="google-first-name"
                  value={googleData.googleUser.first_name}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-last-name">Last name</Label>

                <Input
                  id="google-last-name"
                  value={googleData.googleUser.last_name}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-email">Email</Label>

                <Input
                  id="google-email"
                  type="email"
                  value={googleData.googleUser.email}
                  readOnly
                />
              </div>
            </div>

            {/* Role selection */}
            <div className="space-y-3">
              <Label>How will you use RentNest?</Label>

              <p className="text-sm text-muted-foreground">
                You may select one or both roles.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={roles.includes("TENANT") ? "default" : "outline"}
                  onClick={() => toggleRole("TENANT")}
                >
                  Tenant
                </Button>

                <Button
                  type="button"
                  variant={roles.includes("LANDLORD") ? "default" : "outline"}
                  onClick={() => toggleRole("LANDLORD")}
                >
                  Landlord
                </Button>
              </div>
            </div>

            {/* Tenant fields */}
            {roles.includes("TENANT") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>

                  <Input
                    id="occupation"
                    value={occupation}
                    onChange={(event) => setOccupation(event.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly income</Label>

                  <Input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    value={monthlyIncome}
                    onChange={(event) => setMonthlyIncome(event.target.value)}
                    placeholder="5000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency contact</Label>

                  <Input
                    id="emergencyContact"
                    value={emergencyContact}
                    onChange={(event) =>
                      setEmergencyContact(event.target.value)
                    }
                    placeholder="Name or phone number"
                    required
                  />
                </div>
              </div>
            )}

            {/* Landlord fields */}
            {roles.includes("LANDLORD") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>

                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Example Properties"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business license</Label>

                  <Input
                    id="businessLicense"
                    value={businessLicense}
                    onChange={(event) => setBusinessLicense(event.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>

                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={(event) => setTaxId(event.target.value)}
                    placeholder="Tax identifier"
                    required
                  />
                </div>
              </div>
            )}

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="google-register-form"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Complete registration"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
