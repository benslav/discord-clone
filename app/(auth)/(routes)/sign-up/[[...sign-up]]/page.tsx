import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading sign-up...</p>}>
      <SignUp />
    </Suspense>
  )
}