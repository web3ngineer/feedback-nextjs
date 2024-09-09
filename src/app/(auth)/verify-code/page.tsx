import { Suspense } from "react";
import VerifyAccount from "./VerifyAccount";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccount />
    </Suspense>
  );
}
