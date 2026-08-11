"use client";

import { useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

type PaymentFormProps = {
  returnUrl: string;
  onPaymentConfirmed?: () => void | Promise<void>;
};

export default function PaymentForm({
  returnUrl,
  onPaymentConfirmed,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        return_url: returnUrl,
      },

      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message ?? "Unable to complete the payment.");

      setIsSubmitting(false);
      return;
    }

    /*
     * For card payments that complete without redirecting,
     * refresh the RentNest payment state.
     */
    if (
      paymentIntent?.status === "succeeded" ||
      paymentIntent?.status === "processing"
    ) {
      await onPaymentConfirmed?.();
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
