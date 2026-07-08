"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("All three fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong. Try again.");
      }
      const data = await res.json();
      // Store id in sessionStorage so the flow can persist without exposing it in URL
      sessionStorage.setItem("meta_setup_id", data.id);
      router.push(`/setup?id=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-[1fr_1.2fr] md:gap-24 md:px-12 md:py-24">
        {/* Left: framing */}
        <section className="flex flex-col justify-between">
          <div>
            <p className="eyebrow mb-8">Whitney Bateson · Done-for-You Funnel</p>
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Let&rsquo;s get your
              <br />
              <span className="italic">Meta setup</span> done.
            </h1>
            <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-ink/80">
              This walks you through everything Facebook and Instagram need on your end so we can
              run ads for you. Plan for 30 to 45 minutes and try to do it in one sitting. You can
              come back if you need to, but it&rsquo;s smoother start to finish.
            </p>
          </div>
          <div className="mt-16 hidden md:block">
            <p className="eyebrow mb-3">What you&rsquo;ll do</p>
            <ol className="space-y-2 font-sans text-sm text-ink/70">
              <li>01 &nbsp; Confirm your Facebook account</li>
              <li>02 &nbsp; Confirm or create your business Page</li>
              <li>03 &nbsp; Connect Instagram to your Page</li>
              <li>04 &nbsp; Confirm or create your ad account</li>
              <li>05 &nbsp; Add our team to your Page</li>
              <li>06 &nbsp; Add our team to your ad account</li>
            </ol>
          </div>
        </section>

        {/* Right: form */}
        <section className="flex flex-col justify-center">
          <div className="border-l border-ink/15 pl-8 md:pl-12">
            <p className="eyebrow mb-6">Start</p>
            <form onSubmit={handleStart} className="space-y-8">
              <div>
                <label htmlFor="first_name" className="eyebrow mb-2 block">
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  className="field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="eyebrow mb-2 block">
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  className="field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow mb-2 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {error && (
                <p className="font-sans text-sm text-clay" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Starting…" : "Begin setup"}
              </button>

              <p className="pt-4 font-sans text-xs text-muted">
                Already started? Enter the same email and last name to pick up where you left off.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
