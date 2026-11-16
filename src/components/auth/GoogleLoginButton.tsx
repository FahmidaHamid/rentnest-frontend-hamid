
"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAxiosError } from "axios";

export default function GoogleLoginButton() {
  const router = useRouter();
  const { googleLogin } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="w-full">
      <GoogleLogin
        width="380"
        onSuccess={async (response) => {
          // Clear any previous error.
          setErrorMessage("");

          if (!response.credential) {
            setErrorMessage("Google did not provide a valid credential.");
            return;
          }

          try {
            const result = await googleLogin(response.credential);

            // Existing Google user.
            if (!result.registrationRequired) {
              router.replace("/dashboard");
              return;
            }

            // New Google user.
            if (result.registrationRequired) {
              sessionStorage.setItem(
                "googleRegistration",
                JSON.stringify({
                  registrationToken: result.registrationToken,
                  googleUser: result.googleUser,
                }),
              );

              router.push("/register/google");
            }
          } catch (error) {
            if (isAxiosError(error)) {
              const message = error.response?.data?.message;

              setErrorMessage(
                typeof message === "string" && message.trim()
                  ? message
                  : "Google login failed. Please try again.",
              );
            } else {
              setErrorMessage(
                "An unexpected error occurred. Please try again.",
              );
            }
          }
        }}
        onError={() => {
          setErrorMessage("Google login failed. Please try again.");
        }}
      />

      {errorMessage && (
        <div
          role="alert"
          className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
