"use client";

import { useState } from "react";
import { isAxiosError } from "axios";

import { usePaymentByRequest, usePreparePayment } from "@/hooks/usePayment";

import StripeCheckout from "@/components/payments/StripeCheckout";
import PaymentForm from "@/components/payments/PaymentForm";

import { Button } from "@/components/ui/button";

type ApiErrorResponse = {
  message?: string;
};

type PaymentActionProps = {
  requestId: number;
};

export default function PaymentAction({ requestId }: PaymentActionProps) {
  const paymentQuery = usePaymentByRequest(requestId);
  const preparePaymentMutation = usePreparePayment();

  /*
   * clientSecret exists only after POST /payments/create
   * confirms that Stripe has a checkout-ready PaymentIntent.
   *
   * We intentionally do NOT obtain it from the GET status request.
   */
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePreparePayment(): Promise<void> {
    setErrorMessage(null);

    try {
      const response = await preparePaymentMutation.mutateAsync({
        request_id: requestId,
      });

      const secret = response.data.client_secret;

      if (!secret) {
        /*
         * This can legitimately happen if the backend determines
         * that the payment has already succeeded or is processing.
         */
        await paymentQuery.refetch();
        return;
      }

      setClientSecret(secret);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to prepare payment.",
        );

        return;
      }

      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  /*
   * ============================================
   * QUERY STATE
   * ============================================
   */

  if (paymentQuery.isPending) {
    return (
      <p className="text-sm text-muted-foreground">
        Checking payment status...
      </p>
    );
  }

  if (paymentQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        Unable to check payment status.
      </p>
    );
  }

  const payment = paymentQuery.data.data.payment;

  /*
   * ============================================
   * SUCCESS
   * ============================================
   */

  if (payment?.payment_status === "SUCCESS") {
    return (
      <p className="text-sm font-medium text-emerald-700">Payment completed</p>
    );
  }

  /*
   * ============================================
   * PROCESSING
   * ============================================
   */

  if (payment?.payment_status === "PROCESSING") {
    return (
      <p className="text-sm font-medium text-amber-700">
        Payment processing...
      </p>
    );
  }

  /*
   * ============================================
   * CHECKOUT
   * ============================================
   *
   * Elements is mounted ONLY after POST /create
   * returns a currently valid client secret.
   */

  if (clientSecret) {
    return (
      <StripeCheckout clientSecret={clientSecret}>
        <PaymentForm
          returnUrl={`${window.location.origin}/dashboard/tenant/requests`}
          onPaymentConfirmed={async () => {
            setClientSecret(null);
            await paymentQuery.refetch();
          }}
        />
      </StripeCheckout>
    );
  }

  /*
   * ============================================
   * FAILED / CANCELED BUSINESS PAYMENT
   * ============================================
   */

  if (
    payment?.payment_status === "FAILED" ||
    payment?.payment_status === "CANCELED"
  ) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">
          {payment.payment_status === "FAILED"
            ? "Payment failed."
            : "Payment canceled."}
        </p>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="button"
          disabled={preparePaymentMutation.isPending}
          onClick={handlePreparePayment}
        >
          {preparePaymentMutation.isPending
            ? "Preparing payment..."
            : "Try Again"}
        </Button>
      </div>
    );
  }

  /*
   * ============================================
   * NO PAYMENT / PENDING PAYMENT
   * ============================================
   */

  return (
    <div className="space-y-2">
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button
        type="button"
        disabled={preparePaymentMutation.isPending}
        onClick={handlePreparePayment}
      >
        {preparePaymentMutation.isPending
          ? "Preparing payment..."
          : payment?.payment_status === "PENDING"
            ? "Continue Payment"
            : "Pay Now"}
      </Button>
    </div>
  );
}
