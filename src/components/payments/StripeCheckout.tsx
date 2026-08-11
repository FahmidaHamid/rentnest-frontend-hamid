"use client";

import type { ReactNode } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type StripeCheckoutProps = {
  clientSecret: string;
  children: ReactNode;
};



const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined.");
}

/*
 * Keep loadStripe outside the component so the Stripe object
 * is not recreated whenever the component renders.
 */
const stripePromise = loadStripe(stripePublishableKey);

export default function StripeCheckout({
  clientSecret,
  children,
}: StripeCheckoutProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,

        appearance: {
          theme: "stripe",

          variables: {
            borderRadius: "8px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
