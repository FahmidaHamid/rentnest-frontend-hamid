"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAxiosError } from "axios";

export default function GoogleLoginButton() {
  const router = useRouter();
  const { googleLogin } = useAuth();

  return (
    <div className="w-full">
      <GoogleLogin
        width="380"
        onSuccess={async (response) => {
          if (!response.credential) {
            return;
          }

          try {
            const result = await googleLogin(response.credential);

            if (!result.registrationRequired) {
              router.replace("/dashboard");
              return;
            }

            // sessionStorage.setItem(
            //   "googleRegistration",
            //   JSON.stringify({
            //     registrationToken: result.registrationToken,
            //     googleUser: result.googleUser,
            //   }),
            // );

            // router.push("/google/register");
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
              console.error(
                "Google login backend error:",
                error.response?.data,
              );
            } else {
              console.error("Google login failed:", error);
            }
          }
        }}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </div>
  );
}
