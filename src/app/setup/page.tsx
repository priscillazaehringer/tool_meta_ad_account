import { Suspense } from "react";
import SetupFlow from "./SetupFlow";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-muted">Loading…</div>}>
      <SetupFlow />
    </Suspense>
  );
}
